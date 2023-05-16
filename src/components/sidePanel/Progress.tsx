import { useAtom } from "jotai";
import { gameStateAtom } from "../../states/game";
import { ButtonHTMLAttributes, useEffect, useRef } from "react";
import { useGame } from "../../control/useGame";
import { clsx } from "clsx";

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
    <div className="flex rounded-lg gap-2 m-2 p-2 bg-zinc-500">
      {(gameState.type === "idle" || gameState.type === "ended") && (
        <Button onClick={() => reset()}>Start</Button>
      )}
      {gameState.type === "running" && (
        <>
          <Button onClick={() => reset()}>{reloadSvg}</Button>

          {gameState.mode === "manual" && (
            <Button
              onClick={startAutoplay}
              className="flex items-center justify-center"
            >
              {playSvg}
            </Button>
          )}
          {gameState.mode === "autoplay" && (
            <Button
              onClick={endAutoplay}
              className="flex items-center justify-center"
            >
              {stopSvg}
            </Button>
          )}
          <Button
            onClick={() => runAgent()}
            disabled={gameState.mode === "autoplay"}
            className="flex items-center justify-center gap-2 disabled:bg-slate-500 transition-colors"
          >
            {skipSvg} <span>Next</span>
          </Button>
        </>
      )}
    </div>
  );
}

function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        "bg-slate-300 hover:bg-slate-200 py-2 px-3",
        props.className
      )}
    />
  );
}

const playSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
      clipRule="evenodd"
    />
  </svg>
);

const stopSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
      clipRule="evenodd"
    />
  </svg>
);

const skipSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z" />
  </svg>
);

const reloadSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
      clipRule="evenodd"
    />
  </svg>
);
