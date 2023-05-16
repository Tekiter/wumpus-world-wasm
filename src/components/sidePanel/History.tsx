import { useAtomValue } from "jotai";
import clsx from "clsx";
import { gameHistoryAtom } from "../../states/history";
import { useEffect, useRef } from "react";

export function History(props: { className?: string }) {
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const gameHistory = useAtomValue(gameHistoryAtom);

  useEffect(() => {
    scrollTargetRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [gameHistory]);

  return (
    <div className={clsx("relative", props.className)}>
      <div className="absolute inset-0 overflow-y-scroll">
        {gameHistory.map((entry, idx) => (
          <div
            key={idx}
            className="border-b border-neutral-600 text-neutral-200"
          >
            {entry.type === "agentReasoning" && (
              <div className="px-3 py-2 ">
                <h3 className="text-xs text-gray-500">Agent Reasoning</h3>
                <div className="flex items-center ">
                  <span>{entry.action}</span>
                </div>
              </div>
            )}
            {entry.type === "dead" && (
              <div className="px-3 py-2 bg-rose-950">
                <h3 className="text-xs text-gray-500">Event</h3>
                <div>DEAD by {entry.reason}</div>
              </div>
            )}
            {entry.type === "error" && (
              <div className="px-3 py-2 ">
                <h2>ERROR</h2>
                <p>{entry.message}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={scrollTargetRef}></div>
      </div>
    </div>
  );
}
