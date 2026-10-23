import { file } from "bun";

/**
 * The path of the directory containing the Markdown files with the system prompts.
 */
const sysPromptDir = "backend/agent/prompts/systemPrompts/";

/**
 * Enum that contains the paths of all system prompts.
 */
export enum SystemPromptPath {
  AgentSystemPrompt = sysPromptDir + "agent-system-prompt.md",
  SummarizationSystemPrompt = sysPromptDir + "summarization-system-prompt.md",
}

/**
 * Reads the system prompt at the specified path and returns the contents.
 */
export const getSystemPromptFromFile = async (
  filePath: SystemPromptPath,
): Promise<string> => {
  console.log("Reading system prompt from", filePath);
  const promptFile = file(filePath);
  return await promptFile.text();
};
