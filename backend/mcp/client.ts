import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";

/**
 * Creates a new MCP Client.
 * @param {string} mcpServerVersion - The version of the MCP Server.
 * @param {string} name - The name of the MCP Client to be created.
 * @returns {Client} The created MCP Client.
 */
export function createClient(mcpServerVersion: string, name: string): Client {
  return new Client({ name: name, version: mcpServerVersion });
}

/**
 * Connects a given MCP client to an MCP Server using the given transport instance.
 * @param {Client} client - The MCP Client to be connected.
 * @param {StreamableHTTPClientTransport} transport - The transport used to connect to the MCP Server.
 */
export async function connectClient(
  client: Client,
  transport: StreamableHTTPClientTransport,
): Promise<void> {
  await client.connect(transport);
}
