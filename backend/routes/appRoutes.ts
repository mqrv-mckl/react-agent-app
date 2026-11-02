import { Hono } from "hono";
import { App } from "../environment/app";

export default function createAppApiRoutes() {
  return new Hono()
    .get("/layout", (c) => c.json(App.getInstance().layout))
    .get("/elements", (c) => c.json(App.getInstance().elements));
}
