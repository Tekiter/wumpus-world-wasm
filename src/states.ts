import { atom } from "jotai";
import { range } from "lodash-es";

type WorldCell = {
  type: "none" | "gold" | "wumpus" | "breeze";
  discovered: boolean;
};
export type World = WorldCell[][];

export const worldData = atom<World>(
  range(4).map(() =>
    range(4).map(() => ({
      type: "none" as const,
      discovered: false,
    }))
  )
);

export const actionQueue = atom<string[]>([]);
