export interface Bridge {
  sendAction(action: unknown): void;
  getMemory(): unknown;
  setMemory(memory: unknown): void;
}
