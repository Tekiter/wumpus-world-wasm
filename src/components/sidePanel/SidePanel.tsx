import { Progress } from "./Progress";
import { DebugPanel } from "./Debug";
import { History } from "./History";
import { AgentCode } from "./AgentCode";

export function SidePanel() {
  return (
    <div className="flex flex-col h-full bg-stone-800 ">
      <Progress />
      <AgentCode />

      {`${import.meta.env.VITE_GAME_DEBUG}`.toLowerCase() === "true" && (
        <DebugPanel />
      )}

      <div className="grow">
        <History className="h-full" />
      </div>
    </div>
  );
}
