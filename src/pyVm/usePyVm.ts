import { useContext } from "react";
import { PyVmContext } from "./PyVmProvider";

export function usePyVm() {
  return useContext(PyVmContext);
}
