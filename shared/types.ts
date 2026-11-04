export type Element = {
  id: string;
  name: string;
  category: ElementCategory;
  description: string;
};

// describes all existing categories of elements
export enum ElementCategory {
  System = "SYSTEM",
  Basic = "BASIC",
  Interactive = "INTERACTIVE",
  Container = "CONTAINER",
  Chart = "CHART",
}

export type AgentState = "NOT_RUNNING" | "REASONING" | "EXECUTING_TOOL";

export type WebSocketMessage =
  | {
      type: "agent_message";
      data: string;
    }
  | {
      type: "agent_state";
      data: string;
    };
