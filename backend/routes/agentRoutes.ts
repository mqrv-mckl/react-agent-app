import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";
import type { Agent } from "../agent/agent";

export const sendQuerySchema = z.object({
  query: z.string().describe("The query to be sent to the agent"),
});

export default function createAgentApiRoutes(agent: Agent) {
  return (
    new Hono()

      /**
       * Possible response status codes:
       * - 200: querry successful
       * - 400: agent already running
       */
      .post("/query", sValidator("json", sendQuerySchema), (c) => {
        if (agent.state !== "NOT_RUNNING") {
          c.status(400);
          return c.json({
            message: "Query not accepted. The agent is currently running!",
          });
        }
        const data = c.req.valid("json");
        agent.query(data.query);
        return c.json({ message: "Query successful" });
      })
      .get("/state", (c) => {
        return c.json({ state: agent.state });
      })
      .get("/messageList", (c) => {
        return c.json({ messageList: agent.chatHistory.get() });
      })
  );
}
