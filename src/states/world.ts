import { atomWithReset } from "jotai/utils";
import { times } from "lodash-es";

type WorldCell = {
  type: "none" | "gold" | "wumpus" | "pitch" | "wall";
};

export type World = WorldCell[][];

export const worldData = atomWithReset<World>([
  times(6, () => ({ type: "wall" as const })),
  ...times(4, () => [
    { type: "wall" as const },
    ...times(4, () => ({
      type: "none" as const,
    })),
    { type: "wall" as const },
  ]),
  times(6, () => ({ type: "wall" as const })),
]);
