import { createContext } from "react";
import { Percept } from "./bridge";
import { PlayerAction } from "../states";

interface AgentContext {
  run(
    percept: Percept
  ):
    | { status: "success"; action: PlayerAction }
    | { status: "error"; message: string };
  dead(reason: string): void;
  resetMemory(): void;
}

export const AgentContext = createContext<AgentContext>(
  new Proxy({} as AgentContext, {
    get() {
      throw new Error("Agent context defined");
    },
  })
);
