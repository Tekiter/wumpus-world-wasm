export interface Bridge {
  sendAction(action: unknown): void;
  getMemory(): unknown;
  setMemory(memory: unknown): void;
  getPercept(): Percept;
  isLastDead(): boolean;
  sendPythonError(err: unknown): void;
}

export type Percept = {
  stench: boolean;
  breeze: boolean;
  glitter: boolean;
  bump: boolean;
  scream: boolean;
};
