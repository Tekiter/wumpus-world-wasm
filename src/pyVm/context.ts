import { createContext } from "react";
import { VirtualMachine } from "./rustpython/rustpython_wasm";

interface PyVmContext {
  vm: VirtualMachine | null;
}

export const PyVmContext = createContext<VirtualMachine | null>(null);
