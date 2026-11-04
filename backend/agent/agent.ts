import type { Client } from "@modelcontextprotocol/client";
import type { AgentState } from "../../shared/types.js";
import { broadcastWebSocketMessage } from "../index.js";
import { Chat } from "./chat.js";
import type { ChatHistory } from "./chatHistory.js";
import { Message } from "./message.js";
import {
  getSystemPromptFromFile,
  SystemPromptPath,
} from "./prompts/prompts.js";
import {
  MessageResponseSchema,
  type MessageResponse,
  type Observation,
} from "./types.js";

/**
 * Represents a ReAct agent.
 * @class
 */
export class Agent {
  /**
   * True, if the agent is currently running.
   */
  private _state: AgentState = "NOT_RUNNING";

  get state(): AgentState {
    return this._state;
  }

  private set state(state: AgentState) {
    this._state = state;
    broadcastWebSocketMessage("NOTIFY_AGENT_STATE_CHANGED");
  }

  private _chatHistory: ChatHistory;

  get chatHistory(): ChatHistory {
    return this._chatHistory;
  }

  /**
   * Creates a new Agent instance.
   * @constructor
   * @param {Client} mcpClient - The MCP client instance used for tools.
   * @param {Chat} chat - The Chat instance used by the agent.
   * @param {ChatHistory} chatHistory - The ChatHistory instance used by the agent.
   * @param {number} maxTurns - The maximum number of turns per query before the agent stops.
   */
  constructor(
    private readonly mcpClient: Client,
    private readonly chat: Chat,
    chatHistory: ChatHistory,
    private readonly maxTurns: number,
  ) {
    this._chatHistory = chatHistory;
  }

  /**
   * Initializes the Agent. Must be called before using query!
   * @method
   * @async
   */
  async initialize() {
    // add the system prompt to the chat history
    await this.chatHistory.addMessage(
      new Message("system", await this.getSystemPrompt()),
    );
    console.log("Successfully initialized the agent");
  }

  /**
   * Runs the agent loop for a single user prompt.
   * @method
   * @async
   * @param {string} prompt - The user prompt.
   * @returns {Promise<void>}
   */
  async query(prompt: string): Promise<void> {
    await this.chatHistory.addMessage(new Message("user", prompt));

    for (let i = 0; i < this.maxTurns; i++) {
      let observation: Observation;

      // retrieve parsed response
      this.state = "REASONING";
      try {
        const response = await this.chat.getParsedResponse(
          this.chatHistory.get(),
          MessageResponseSchema,
        );

        // add the LLM's response to messages
        await this.chatHistory.addMessage(
          new Message("assistant", JSON.stringify(response)),
        );

        // check if final answer
        if (response.isFinalAnswer) {
          console.log("Final Answer:", response.thought, "\n");
          this.state = "NOT_RUNNING";
          return;
        }

        // execute action
        try {
          this.state = "EXECUTING_TOOL";
          observation = await this.executeAction(response);
        } catch (e) {
          observation = {
            success: false,
            data: {
              errorMessage:
                "An error occurred while running the tool" +
                (e instanceof Error ? ": " + e.message : "."),
            },
          };
        }
      } catch (e) {
        if (e instanceof Error) {
          await this.chatHistory.addMessage(
            new Message("assistant", "(Error while retrieving the response)"),
          );
          observation = {
            success: false,
            data: {
              errorMessage: e.message,
            },
          };
        } else {
          this.state = "NOT_RUNNING";
          throw e;
        }
      }

      // add observation to messages
      await this.chatHistory.addMessage(
        new Message("user", JSON.stringify(observation)),
      );

      // check if turn limit reached
      if (i === this.maxTurns - 1) {
        console.warn("Turn limit reached. Stopped without a final answer.");
      }
    }
    this.state = "NOT_RUNNING";
  }

  /**
   * Assembles and returns the system prompt.
   * @method
   * @async
   * @returns {Promise<string>} A promise that resolves with the complete system prompt.
   */
  private async getSystemPrompt(): Promise<string> {
    return (
      (await getSystemPromptFromFile(SystemPromptPath.AgentSystemPrompt)) +
      (await this.getToolString())
    );
  }

  /**
   * Builds and returns a string that lists all of the agent's tools in JSON format.
   * @method
   * @async
   * @returns {Promise<string>} A Promise that resolves with the list of the agent's tools in JSON format.
   */
  private async getToolString(): Promise<string> {
    const { tools } = await this.mcpClient.listTools();
    return tools
      .map((t) =>
        JSON.stringify({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        }),
      )
      .join("\n");
  }

  /**
   * Executes a tool specified within a MessageResponse object.
   * Be sure to parse the MessageResponse object before passing it, since it is not parsed within this method.
   * @method
   * @async
   * @param {MessageResponse} parsedResponse - The parsed MessageResponse object that contains the tool to be executed.
   * @returns {Promise<Observation>} A promise that resolves with an observation that contains informations about tool execution and potential errors.
   */
  private async executeAction(
    parsedResponse: MessageResponse,
  ): Promise<Observation> {
    const result = await this.mcpClient.callTool({
      name: parsedResponse.action,
      arguments: parsedResponse.actionInput,
    });

    return {
      success: !result.isError,
      data: result.content,
    };
  }
}
