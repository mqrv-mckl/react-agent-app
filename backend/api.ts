import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";
import type { Agent } from "./agent/agent";

export const sendQuerySchema = z.object({
  query: z.string().describe("The query to be sent to the agent"),
});

export default function createApiRoutes(agent: Agent): Hono {
  const api = new Hono();

  /**
   * Possible response codes:
   * - 200: successfully querried the agent
   * - 409: agent already runnign
   */
  api.post("/query", sValidator("json", sendQuerySchema), (c) => {
    if (agent.isRunning) {
      return c.json(409);
    }
    const data = c.req.valid("json");
    agent.query(data.query);
    return c.json(200);
  });

  api.get("/agent/isRunning", (c) => {
    return c.text(`${agent.isRunning}`);
  });

  return api;
}
