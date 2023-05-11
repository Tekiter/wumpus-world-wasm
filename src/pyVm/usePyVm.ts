import { useContext } from "react";
import { PyVmContext } from "./context";

export function usePyVm() {
  return useContext(PyVmContext);
}
