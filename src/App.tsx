import { useEffect } from "react";
import "./App.css";
import init, { vmStore } from "./rustpython/rustpython_wasm";
import wasmUrl from "./rustpython/rustpython_wasm_bg.wasm?url";
import mainpy from "./pysrc/main.py?raw";
import * as agent from "./agent";

function App() {
  useEffect(() => {
    init(wasmUrl).then(() => {
      const vm = vmStore.init("webpy");
      vm.setStdout(console.log);

      vm.injectJSModule("agent", agent);

      vm.exec(mainpy);

      vm.destroy();
    });
  }, []);

  return (
    <>
      <div></div>
    </>
  );
}

export default App;
