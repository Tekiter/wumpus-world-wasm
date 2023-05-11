import { useContext } from "react";
import { AgentContext } from "./AgentProvider";

export function useAgent() {
  return useContext(AgentContext);
}
