import { ButtonHTMLAttributes } from "react";
import { useGame } from "../../control/useGame";

const actions = [
  "GoForward",
  "TurnLeft",
  "TurnRight",
  "Grab",
  "Shoot",
  "Climb",
] as const;

export function DebugPanel() {
  const { processAction } = useGame();

  return (
    <div className="flex flex-wrap">
      {actions.map((action) => (
        <Button key={action} onClick={() => processAction(action)}>
          {action}
        </Button>
      ))}
    </div>
  );
}

function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className="bg-slate-300 hover:bg-slate-200 py-2 px-3" />
  );
}
