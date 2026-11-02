import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";
import type { Agent } from "./agent/agent";
import { App } from "./environment/app";

const AGENT_ROUTE = "/agent";
const APP_ROUTE = "/app";

export const sendQuerySchema = z.object({
  query: z.string().describe("The query to be sent to the agent"),
});

export function createAgentApiRoutes(agent: Agent) {
  return (
    new Hono()

      /**
       * Possible response status codes:
       * - 200: querry successful
       * - 400: agent already running
       */
      .post(
        AGENT_ROUTE + "/query",
        sValidator("json", sendQuerySchema),
        (c) => {
          if (agent.isRunning) {
            c.status(400);
            return c.json({
              message: "Query not accepted. The agent is currently running!",
            });
          }
          const data = c.req.valid("json");
          agent.query(data.query);
          return c.json({ message: "Query successful" });
        },
      )

      .get(AGENT_ROUTE + "/isRunning", (c) => {
        return c.text(`${agent.isRunning}`);
      })
  );
}

export function createAppApiRoutes() {
  return new Hono()
    .get(APP_ROUTE + "/layout", (c) => c.json(App.getInstance().layout))
    .get(APP_ROUTE + "/elements", (c) => c.json(App.getInstance().elements));
}
