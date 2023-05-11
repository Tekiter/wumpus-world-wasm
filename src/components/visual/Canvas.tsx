import { useAtom } from "jotai";
import { worldData } from "../../states";

export function Canvas() {
  const world = useAtom(worldData);

  return <div>{JSON.stringify(world)}</div>;
}
