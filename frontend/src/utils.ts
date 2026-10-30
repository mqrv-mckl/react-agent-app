import type { Message } from "../../shared/types";

export function isUserQuery(message: Message): boolean {
  return isValidJSON(message.content);
}

function isValidJSON(string: string) {
  try {
    JSON.parse(string);
    return true;
  } catch {
    return false;
  }
}
