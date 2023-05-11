export function createBridge() {
  return {
    setWorld(world: unknown) {
      console.log("world", world);
    },
    sendAction(action: unknown) {
      console.log("action", action);
    },
  };
}

export interface Bridge {
  getWorld(): unknown;
  sendAction(action: unknown): void;
}
