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
