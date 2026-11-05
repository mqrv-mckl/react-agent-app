import { isValidJSON } from "../utils";
import { MessageResponseSchema } from "./types";

export type MessageRole = "system" | "user" | "assistant";

/**
 * Represents an agent message.
 * @class
 */
export class Message {
  /**
   * The role which represents the sender of the message.
   */
  private _role: MessageRole;
  /**
   * The content of the message.
   */
  private _content: string;

  /**
   * Creates a new Message instance.
   * @constructor
   */
  constructor(role: MessageRole, content: string) {
    this._role = role;
    this._content = content;
  }

  get role(): MessageRole {
    return this._role;
  }

  set role(role: MessageRole) {
    this._role = role;
  }

  get content(): string {
    return this._content;
  }

  set content(content: string) {
    this._content = content;
  }

  /**
   * True, if this message is a user query.
   */
  isUserQuery(): boolean {
    return this._role === "user" && !isValidJSON(this._content);
  }

  /**
   * True, if the message is an observation.
   */
  isObservation(): boolean {
    return this._role === "user" && isValidJSON(this._content);
  }

  /**
   * Returns the error message if present.
   */
  getErrorMessage(): string | undefined {
    try {
      return JSON.parse(this._content).data.errorMessage;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * True, if this message is a response from the agent.
   */
  isAgentResponse(): boolean {
    if (isValidJSON(this.content)) {
      if (this._role === "assistant") {
        const parsed = MessageResponseSchema.safeParse(
          JSON.parse(this._content),
        );
        return parsed.success;
      }
    }
    return false;
  }

  /**
   * Returns the thought part of the agent response. Can only be called on agent responses.
   * @throws {Error} If this message is no agent response.
   */
  getAgentThought(): string {
    if (!this.isAgentResponse()) {
      throw new Error(
        "Can't get agent thought on a message that is no agent response. Hint: Check with message.isAgentResponse() first.",
      );
    }
    return MessageResponseSchema.parse(JSON.parse(this._content)).thought;
  }

  /**
   * True, if this message is a final answer.
   * @throws {Error} If this message is no agent response.
   */
  isFinalAnswer(): boolean {
    if (!this.isAgentResponse()) {
      throw new Error(
        "Only agent resonses can be a final answer. Hint: Check with message.isAgentResponse() first.",
      );
    }
    return MessageResponseSchema.parse(JSON.parse(this._content)).isFinalAnswer;
  }

  // TODO: add helper described in the todo in chatHistory

  // TODO: look for other possible helpers to reduce redundancy and seperate concerns

  /**
   * Returns the stringified JSON representation.
   */
  toString(): string {
    return JSON.stringify(this.toJSON());
  }

  /**
   * Returns the JSON representation.
   */
  toJSON(): {
    role: MessageRole;
    content: string;
  } {
    return {
      role: this._role,
      content: this._content,
    };
  }
}
