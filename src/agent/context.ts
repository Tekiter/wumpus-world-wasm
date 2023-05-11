import { createContext } from "react";
import { Percept } from "../bridge";

interface AgentContext {
  run(percept: Percept): string;
  resetMemory(): void;
}

export const AgentContext = createContext<AgentContext>(
  new Proxy({} as AgentContext, {
    get() {
      throw new Error("Agent context defined");
    },
  })
);
