import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { concat, constant, range, times } from "lodash-es";

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

export const worldDiscovered = atomWithReset(
  times(6, () => times(6, constant(false)))
);

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

export type PlayerAction = [
  "GoForward",
  "TurnLeft",
  "TurnRight",
  "Grab",
  "Shoot",
  "Climb",
  "None"
][number];

export const actionQueue = atom<PlayerAction[]>([]);
