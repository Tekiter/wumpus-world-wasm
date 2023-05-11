import { atom } from "jotai";
import { concat, constant, range, times } from "lodash-es";

type WorldCell = {
  type: "none" | "gold" | "wumpus" | "breeze" | "wall";
};

export type World = WorldCell[][];

export const worldData = atom<World>([
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

export const worldDiscovered = atom(times(6, () => times(6, constant(false))));

type PlayerData = {
  x: number;
  y: number;
  direction: "N" | "E" | "W" | "S";
  gold: number;
  arrow: number;
};

export const playerData = atom<PlayerData>({
  x: 1,
  y: 1,
  direction: "E",
  gold: 0,
  arrow: 2,
});

export const actionQueue = atom<string[]>([]);
