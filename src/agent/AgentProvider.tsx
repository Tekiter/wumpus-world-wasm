import { ReactNode, useRef } from "react";
import { Bridge, Percept } from "./bridge";
import { usePyVm } from "../pyVm/usePyVm";
import { mainpy } from "../pysrc";
import { AgentContext } from "./context";
import { z } from "zod";
import { PlayerAction } from "../states";
import { useAtomValue } from "jotai";
import { agentCodeAtom } from "../states/agentCode";

interface AgentProviderProps {
  children: ReactNode;
  onAgentError?(message: string): void;
  onAgentPrint?(message: string): void;
}

export function AgentProvider({
  children,
  onAgentError,
  onAgentPrint,
}: AgentProviderProps) {
  const pyVm = usePyVm();
  const agentMemory = useRef<unknown>(undefined);
  const isLastDead = useRef<boolean>(false);

  const agentpy = useAtomValue(agentCodeAtom);

  function runAgent(percept: Percept) {
    if (!pyVm) {
      throw new Error("Agent not set");
    }

    let receivedAction: PlayerAction = "None";
    let errorThrown: string | null = "";

    if (onAgentPrint) {
      pyVm.setStdout(onAgentPrint);
    }

    pyVm.injectModule("agent", agentpy);

    pyVm.injectJSModule("bridge", {
      sendAction(action) {
        const actionSchema = z.union([
          z.literal("GoForward"),
          z.literal("TurnLeft"),
          z.literal("TurnRight"),
          z.literal("Grab"),
          z.literal("Shoot"),
          z.literal("Climb"),
          z.literal("NoExit"),
        ]);

        const result = actionSchema.safeParse(action);

        if (result.success) {
          receivedAction = result.data;
        } else {
          errorThrown = `${action}은 올바른 Action이 아닙니다. `;
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
          if (o instanceof Array) {
            return o.map((item) => convertToObj(item));
          }
          return o;
        }

        const newMemory = convertToObj(memory);
        agentMemory.current = newMemory;
      },
      isLastDead() {
        return isLastDead.current;
      },
      sendPythonError(err) {
        console.error("[PythonError]", err);
        errorThrown = `${err}`;
        onAgentError?.(`${err}`);
      },
    } satisfies Bridge);

    pyVm.exec(mainpy);
    isLastDead.current = false;

    if (errorThrown) {
      return { status: "error", message: errorThrown } as const;
    }

    return { status: "success", action: receivedAction } as const;
  }

  function dead() {
    isLastDead.current = true;
  }

  function resetMemory() {
    agentMemory.current = {};
  }

  return (
    <AgentContext.Provider
      value={{
        run: runAgent,
        dead,
        resetMemory,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}
