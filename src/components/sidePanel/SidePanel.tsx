import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useAgent } from "../../agent/useAgent";
import { World, playerData, worldData, worldDiscovered } from "../../states";
import { cloneDeep, range } from "lodash-es";

export function SidePanel() {
  const agent = useAgent();
  const [world, setWorld] = useAtom(worldData);
  const resetWorld = useResetAtom(worldData);
  const [discovered, setDiscovered] = useAtom(worldDiscovered);
  const resetDiscovered = useResetAtom(worldDiscovered);
  const [player, setPlayer] = useAtom(playerData);

  function runAgent() {
    const nextAction = agent.run({
      breeze: false,
      bump: false,
      glitter: false,
      scream: false,
      stench: false,
    });
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

      world[4][4] = { type: "gold" };

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

  return (
    <div className="flex flex-col">
      <button onClick={runAgent}>gogo</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
