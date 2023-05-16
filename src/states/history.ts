import { atom } from "jotai";

type HistoryCell =
  | {
      type: "agentReasoning";
      percept: {
        breeze: boolean;
        glitter: boolean;
        stench: boolean;
        bump: boolean;
        scream: boolean;
      };
      action: string;
    }
  | {
      type: "error";
      message: string;
    }
  | {
      type: "agentPrint";
      message: string;
    }
  | {
      type: "dead";
      reason: string;
    };

export const gameHistoryAtom = atom<HistoryCell[]>([]);
