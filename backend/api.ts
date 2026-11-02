import { Hono } from "hono";
import createAgentApiRoutes from "./routes/agentRoutes";
import type { Agent } from "./agent/agent";
import createAppApiRoutes from "./routes/appRoutes";

export default function createApiRoutes(agent: Agent) {
  return new Hono()
    .route("/agent", createAgentApiRoutes(agent))
    .route("/app", createAppApiRoutes());
}
