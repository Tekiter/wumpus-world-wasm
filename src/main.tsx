import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PyVmProvider } from "./PyVm.tsx";
import { AgentProvider } from "./agent.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PyVmProvider>
      <AgentProvider>
        <App />
      </AgentProvider>
    </PyVmProvider>
  </React.StrictMode>
);
