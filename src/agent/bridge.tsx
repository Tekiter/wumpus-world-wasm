export interface Bridge {
  sendAction(action: unknown): void;
  getMemory(): unknown;
  setMemory(memory: unknown): void;
  getPercept(): Percept;
  getLastDead(): null | string;
  sendPythonError(err: unknown): void;
}

export type Percept = {
  stench: boolean;
  breeze: boolean;
  glitter: boolean;
  bump: boolean;
  scream: boolean;
};
