import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import init, { VirtualMachine, vmStore } from "./rustpython/rustpython_wasm";
import wasmUrl from "./rustpython/rustpython_wasm_bg.wasm?url";
import agentpy from "./pysrc/agent.py?raw";

interface PyVmContext {
  vm: VirtualMachine | null;
}

const PyVmContext = createContext<VirtualMachine | null>(null);

interface PyVmProviderProps {
  children: ReactNode;
}

export function PyVmProvider({ children }: PyVmProviderProps) {
  const [pyVm, setPyVm] = useState<VirtualMachine | null>(null);

  useEffect(() => {
    let vm: VirtualMachine;

    init(wasmUrl).then(() => {
      vm = vmStore.init("webpy");
      vm.setStdout((str: unknown) => console.log("[PythonOutput]:", str));
      vm.addToScope("__name__", "__main__");

      vm.injectModule("agent", agentpy);

      setPyVm(vm);
    });

    return () => {
      if (vm) {
        vm.destroy();
        setPyVm(null);
      }
    };
  }, []);

  return <PyVmContext.Provider value={pyVm}>{children}</PyVmContext.Provider>;
}

export function usePyVm() {
  return useContext(PyVmContext);
}
