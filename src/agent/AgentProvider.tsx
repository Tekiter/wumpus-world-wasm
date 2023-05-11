import { ReactNode, useRef } from "react";
import { Bridge, Percept } from "../bridge";
import { usePyVm } from "../pyVm/usePyVm";
import { mainpy } from "../pysrc";
import { AgentContext } from "./context";

interface AgentProviderProps {
  children: ReactNode;
}

export function AgentProvider({ children }: AgentProviderProps) {
  const pyVm = usePyVm();
  const agentMemory = useRef<unknown>(undefined);

  function runAgent(percept: Percept) {
    if (!pyVm) {
      throw new Error("Agent not set");
    }

    let receivedAction = "";

    pyVm.injectJSModule("bridge", {
      sendAction(action) {
        if (typeof action === "string") {
          receivedAction = action;
        }
      },
      getPercept() {
        return percept;
      },
      getMemory() {
        return agentMemory.current;
      },
      setMemory(memory: unknown) {
        if (!(memory instanceof Map)) {
          throw new Error("Cannot save memory.");
        }

        function convertToObj(o: unknown): unknown {
          if (o instanceof Map) {
            return Object.fromEntries(
              [...o.entries()].map(([k, v]) => [k, convertToObj(v)])
            );
          }
          return o;
        }

        const newMemory = convertToObj(memory);
        agentMemory.current = newMemory;
      },
    } satisfies Bridge);

    pyVm.exec(mainpy);

    return receivedAction;
  }

  function resetMemory() {
    agentMemory.current = {};
  }

  return (
    <AgentContext.Provider
      value={{
        run: runAgent,
        resetMemory,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}
