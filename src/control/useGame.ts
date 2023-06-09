import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { cloneDeep, range } from "lodash-es";
import { useAgent } from "../agent/useAgent";
import {
  playerData,
  worldDiscovered,
  PlayerAction,
  lastEvent,
  playerPercept,
  removedWumpusAtom,
} from "../states";
import { gameStateAtom } from "../states/game";
import { worldData } from "../states/world";
import { gameHistoryAtom } from "../states/history";

const dirCycle = ["E", "S", "W", "N"] as const;
const dirNext = {
  E: [0, 1],
  S: [-1, 0],
  W: [0, -1],
  N: [1, 0],
};

export function useGame() {
  const agent = useAgent();
  const [world, setWorld] = useAtom(worldData);
  const resetWorld = useResetAtom(worldData);
  const [, setDiscovered] = useAtom(worldDiscovered);
  const [removedWumpus, setRemovedWumpus] = useAtom(removedWumpusAtom);
  const resetDiscovered = useResetAtom(worldDiscovered);
  const [player, setPlayer] = useAtom(playerData);
  const [, setLast] = useAtom(lastEvent);
  const percept = useAtomValue(playerPercept);
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [, setGameHistory] = useAtom(gameHistoryAtom);

  function runAgent() {
    if (gameState.type === "idle") {
      return;
    }

    const agentResult = agent.run(percept);

    if (agentResult.status === "error") {
      setGameHistory((history) => [
        ...history,
        { type: "error", message: agentResult.message },
      ]);
      return;
    }

    setGameHistory((gameHistory) => [
      ...gameHistory,
      { type: "agentReasoning", action: agentResult.action, percept },
    ]);

    processAction(agentResult.action);
  }

  function processAction(action: PlayerAction) {
    setLast({
      bump: false,
      scream: false,
    });

    if (action === "GoForward") {
      const [dy, dx] = dirNext[player.direction];
      const ny = player.y + dy;
      const nx = player.x + dx;

      setDiscovered((discovered) => {
        const newDiscovered = cloneDeep(discovered);
        newDiscovered[ny][nx] = true;
        return newDiscovered;
      });

      if (world[ny][nx].type === "wall") {
        setLast((last) => ({ ...last, bump: true }));
        return;
      } else if (
        (world[ny][nx].type === "wumpus" &&
          !removedWumpus.find((v) => v.y === ny && v.x === nx)) ||
        world[ny][nx].type === "pitch"
      ) {
        const type = world[ny][nx].type;

        setPlayer((player) => ({
          ...player,
          x: 1,
          y: 1,
          gold: 0,
          direction: "E",
          arrow: 2,
        }));

        setGameHistory((history) => [
          ...history,
          { type: "dead", reason: type },
        ]);

        setRemovedWumpus([]);

        agent.dead(type);
        return;
      }

      setPlayer((player) => ({
        ...player,
        y: ny,
        x: nx,
      }));
    } else if (action === "TurnLeft") {
      setPlayer((player) => {
        const didx = dirCycle.indexOf(player.direction);
        const nextDirection = dirCycle[(didx - 1 + 4) % 4];
        return { ...player, direction: nextDirection };
      });
    } else if (action === "TurnRight") {
      setPlayer((player) => {
        const didx = dirCycle.indexOf(player.direction);
        const nextDirection = dirCycle[(didx + 1) % 4];
        return { ...player, direction: nextDirection };
      });
    } else if (action === "Grab") {
      if (world[player.y][player.x].type === "gold") {
        setPlayer((player) => ({ ...player, gold: 1 }));
      }
    } else if (action === "Climb") {
      if (player.y === 1 && player.x === 1) {
        if (player.gold >= 1) {
          setGameState({ type: "ended", reason: "exited" });
        }
      }
    } else if (action === "Shoot") {
      if (player.arrow > 0) {
        let ny = player.y;
        let nx = player.x;

        const [dy, dx] = dirNext[player.direction];
        ny += dy;
        nx += dx;

        if (world[ny][nx].type === "wumpus") {
          setLast((last) => ({ ...last, scream: true }));
          setRemovedWumpus((removedWumpus) => [
            ...removedWumpus,
            { y: ny, x: nx },
          ]);
          setPlayer((player) => ({ ...player, arrow: player.arrow - 1 }));
        }
      }
    } else if (action === "NoExit") {
      setGameState({ type: "ended", reason: "noExit" });
    }
  }

  function reset() {
    resetWorld();
    resetDiscovered();
    setRemovedWumpus([]);
    setLast({ bump: false, scream: false });
    setGameHistory([]);

    setWorld((world) => {
      const newWorld = cloneDeep(world);

      range(1, 5).forEach((y) =>
        range(1, 5).forEach((x) => {
          if (y == 1 && x == 1) {
            return;
          }

          if (Math.random() <= 0.1) {
            newWorld[y][x] = {
              type: "wumpus" as const,
            };
          } else if (Math.random() <= 0.11) {
            newWorld[y][x] = {
              type: "pitch" as const,
            };
          }

          return;
        })
      );

      newWorld[4][4] = { type: "gold" };

      return newWorld;
    });

    setPlayer({
      x: 1,
      y: 1,
      arrow: 2,
      direction: "E",
      gold: 0,
    });

    setDiscovered((discovered) => {
      const newDiscovered = cloneDeep(discovered);
      newDiscovered[1][1] = true;
      return newDiscovered;
    });

    setGameState({ type: "running", mode: "manual" });

    agent.resetMemory();
  }

  return { runAgent, reset, processAction, player };
}
