import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";
import type { Agent } from "./agent/agent";

export const sendQuerySchema = z.object({
  query: z.string().describe("The query to be sent to the agent"),
});

export default function createApiRoutes(agent: Agent) {
  return (
    new Hono()

      /**
       * Possible response status codes:
       * - 200: querry successful
       * - 400: agent already running
       */
      .post("/agent/query", sValidator("json", sendQuerySchema), (c) => {
        if (agent.isRunning) {
          c.status(400);
          return c.json({
            message: "Query not accepted. The agent is currently running!",
          });
        }
        const data = c.req.valid("json");
        agent.query(data.query);
        return c.json({ message: "Query successful" });
      })

      .get("/agent/isRunning", (c) => {
        return c.text(`${agent.isRunning}`);
      })
  );
}
