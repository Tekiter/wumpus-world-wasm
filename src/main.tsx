import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PyVmProvider } from "./pyVm/PyVmProvider.tsx";
import { AgentProvider } from "./agent/AgentProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PyVmProvider>
      <AgentProvider>
        <App />
      </AgentProvider>
    </PyVmProvider>
  </React.StrictMode>
);
