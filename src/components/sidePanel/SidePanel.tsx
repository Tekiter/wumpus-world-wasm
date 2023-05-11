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

export function SidePanel() {
  const { runAgent, reset, processAction } = useGame();

  return (
    <div className="flex flex-col">
      <Button onClick={runAgent}>gogo</Button>
      <Button onClick={reset}>Reset</Button>
      <div className="flex flex-wrap">
        {actions.map((action, idx) => (
          <Button key={action} onClick={() => processAction(action)}>
            {action}
          </Button>
        ))}
      </div>
    </div>
  );
}

function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className="bg-slate-300 hover:bg-slate-200 py-2 px-3" />
  );
}
