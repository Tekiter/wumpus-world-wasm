import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { constant, times } from "lodash-es";
import { worldData } from "./world";

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

export const lastEvent = atom({
  bump: false,
  scream: false,
});

export const removedWumpusAtom = atom<{ x: number; y: number }[]>([]);

export const playerPercept = atom((get) => {
  const { x, y } = get(playerData);
  const world = get(worldData);
  const last = get(lastEvent);

  const percept = {
    breeze: false,
    glitter: false,
    stench: false,
    bump: last.bump,
    scream: last.scream,
  };

  if (world[y][x].type === "gold") {
    percept.glitter = true;
  }

  for (const [dy, dx] of [
    [0, 1],
    [1, 0],
    [0, -1],
    [0, 1],
  ]) {
    const ny = y + dy;
    const nx = x + dx;

    if (world[ny][nx].type === "wumpus") {
      percept.stench = true;
    } else if (world[ny][nx].type === "pitch") {
      percept.breeze = true;
    }
  }

  return percept;
});

export type PlayerAction = [
  "GoForward",
  "TurnLeft",
  "TurnRight",
  "Grab",
  "Shoot",
  "Climb",
  "None",
  "NoExit"
][number];

export const actionQueue = atom<PlayerAction[]>([]);
