import { atom } from "jotai";

type GameState =
  | {
      type: "idle";
    }
  | { type: "running"; mode: "autoplay" | "manual" }
  | { type: "ended" };

export const gameStateAtom = atom<GameState>({
  type: "idle",
});
