import { atomWithStorage } from "jotai/utils";
import agentpy from "../pysrc/agent.py?raw";

export const bundledAgentCode = agentpy;

export const agentCodeAtom = atomWithStorage("wumpus-agent-code", agentpy);
