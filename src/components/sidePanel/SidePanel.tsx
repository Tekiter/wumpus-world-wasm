import { useAtomValue } from "jotai";
import { playerData, playerPercept } from "../../states";
import { Progress } from "./Progress";
import { DebugPanel } from "./Debug";

export function SidePanel() {
  const percept = useAtomValue(playerPercept);
  const player = useAtomValue(playerData);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <Progress />
      <div className="whitespace-pre-wrap">
        {JSON.stringify(percept, null, 2)}
      </div>
      <div className="whitespace-pre-wrap">
        {JSON.stringify(player, null, 2)}
      </div>
      {`${import.meta.env.VITE_GAME_DEBUG}`.toLowerCase() === "true" && (
        <DebugPanel />
      )}
    </div>
  );
}
