import { atom } from "jotai";

type GameState =
  | {
      type: "idle";
    }
  | { type: "running" }
  | { type: "ended" };

export const gameStateAtom = atom<GameState>({
  type: "idle",
});
