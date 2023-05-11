import { ReactNode, useRef } from "react";
import { Bridge, Percept } from "../bridge";
import { usePyVm } from "../pyVm/usePyVm";
import { mainpy } from "../pysrc";
import { AgentContext } from "./context";
import { z } from "zod";
import { PlayerAction } from "../states";

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

    let receivedAction: PlayerAction = "None";

    pyVm.injectJSModule("bridge", {
      sendAction(action) {
        const actionSchema = z.union([
          z.literal("GoForward"),
          z.literal("TurnLeft"),
          z.literal("TurnRight"),
          z.literal("Grab"),
          z.literal("Shoot"),
          z.literal("Climb"),
        ]);

        const result = actionSchema.safeParse(action);

        if (result.success) {
          receivedAction = result.data;
        } else {
          throw new Error(`Invalid agent action: ${action}`);
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
