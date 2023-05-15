import { useAtom } from "jotai";
import { gameStateAtom } from "../../states/game";
import { ButtonHTMLAttributes, useEffect, useRef } from "react";
import { useGame } from "../../control/useGame";

export function Progress() {
  const { runAgent, reset } = useGame();
  const [gameState, setGameState] = useAtom(gameStateAtom);

  const runFn = useRef<() => void>();

  useEffect(() => {
    const tm = setInterval(() => {
      runFn.current?.();
    }, 1000);

    return () => {
      clearInterval(tm);
    };
  }, []);

  useEffect(() => {
    runFn.current = () => {
      if (gameState.type === "running" && gameState.mode === "autoplay") {
        runAgent();
      }
    };
  }, [runAgent, gameState]);

  function startAutoplay() {
    setGameState({
      type: "running",
      mode: "autoplay",
    });
  }

  function endAutoplay() {
    setGameState({
      type: "running",
      mode: "manual",
    });
  }

  return (
    <div className="flex">
      {(gameState.type === "idle" || gameState.type === "ended") && (
        <Button onClick={() => reset()}>Start</Button>
      )}
      {gameState.type === "running" && (
        <>
          <Button onClick={() => reset()}>Reset</Button>
          <Button
            onClick={() => runAgent()}
            disabled={gameState.mode === "autoplay"}
          >
            Next
          </Button>
          {gameState.mode === "manual" && (
            <Button onClick={startAutoplay}>Play</Button>
          )}
          {gameState.mode === "autoplay" && (
            <Button onClick={endAutoplay}>Pause</Button>
          )}
        </>
      )}
    </div>
  );
}

function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className="bg-slate-300 hover:bg-slate-200 py-2 px-3" />
  );
}
