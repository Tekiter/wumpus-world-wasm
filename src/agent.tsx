import { ReactNode, createContext, useContext } from "react";
import mainpy from "./pysrc/main.py?raw";
import { Bridge } from "./bridge";
import { World } from "./states";
import { usePyVm } from "./PyVm";

interface AgentContext {
  run(world: World): string;
}

const AgentContext = createContext<AgentContext>(
  new Proxy({} as AgentContext, {
    get() {
      throw new Error("Not defined");
    },
  })
);

interface AgentProviderProps {
  children: ReactNode;
}

export function AgentProvider({ children }: AgentProviderProps) {
  const pyVm = usePyVm();

  function runAgent(world: World) {
    if (!pyVm) {
      throw new Error("Agent not set");
    }

    let receivedAction = "";

    pyVm.injectJSModule("bridge", {
      getWorld() {
        return world;
      },
      sendAction(action) {
        if (typeof action === "string") {
          receivedAction = action;
        }
        console.log(action);
      },
    } satisfies Bridge);

    pyVm.exec(mainpy);

    return receivedAction;
  }

  return (
    <AgentContext.Provider
      value={{
        run: runAgent,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  return useContext(AgentContext);
}
