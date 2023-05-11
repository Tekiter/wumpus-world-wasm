import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { cloneDeep, range } from "lodash-es";
import { useAgent } from "../agent/useAgent";
import {
  playerData,
  worldData,
  worldDiscovered,
  PlayerAction,
  lastEvent,
  playerPercept,
} from "../states";

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
  const [discovered, setDiscovered] = useAtom(worldDiscovered);
  const resetDiscovered = useResetAtom(worldDiscovered);
  const [player, setPlayer] = useAtom(playerData);
  const [, setLast] = useAtom(lastEvent);
  const percept = useAtomValue(playerPercept);

  function runAgent() {
    const nextAction = agent.run(percept);

    processAction(nextAction);
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

      if (world[ny][nx].type === "wall") {
        setLast((last) => ({ ...last, bump: true }));
        return;
      }

      setDiscovered((discovered) => {
        const newDiscovered = cloneDeep(discovered);
        newDiscovered[ny][nx] = true;
        return newDiscovered;
      });

      if (world[ny][nx].type === "wumpus" || world[ny][nx].type === "pitch") {
        setPlayer((player) => ({
          ...player,
          x: 1,
          y: 1,
          gold: 0,
          direction: "E",
          arrow: 2,
        }));
        agent.dead();
        return;
      }

      if (world[ny][nx].type === "gold") {
        setPlayer((player) => ({
          ...player,
          gold: 1,
        }));
        setWorld((world) => {
          const newWorld = cloneDeep(world);
          newWorld[ny][nx].type = "none";
          return newWorld;
        });
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
    }
  }

  function reset() {
    resetWorld();
    resetDiscovered();
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
  }

  return { runAgent, reset, processAction, player };
}
