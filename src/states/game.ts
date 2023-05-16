import { atom } from "jotai";

type GameState =
  | {
      type: "idle";
    }
  | { type: "running"; mode: "autoplay" | "manual" }
  | { type: "ended"; reason: "exited" | "noExit" };

export const gameStateAtom = atom<GameState>({
  type: "idle",
});
