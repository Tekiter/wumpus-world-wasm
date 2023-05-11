import { useContext } from "react";
import { AgentContext } from "./context";

export function useAgent() {
  return useContext(AgentContext);
}
