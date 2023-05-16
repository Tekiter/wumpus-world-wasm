import { ReactNode, useEffect, useState } from "react";
import init, { VirtualMachine, vmStore } from "./rustpython/rustpython_wasm";
import wasmUrl from "./rustpython/rustpython_wasm_bg.wasm?url";
import { PyVmContext } from "./context";

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
