import { useAtomValue } from "jotai";
import { getGridPosition } from "./position";
import { playerData } from "../../states";

const dirCycle = ["E", "S", "W", "N"] as const;

export function Player() {
  const player = useAtomValue(playerData);
  const { xPos, yPos } = getGridPosition(player.y, player.x);

  return (
    <group
      position={[xPos, 2, yPos]}
      rotation={[0, (Math.PI / 2) * -dirCycle.indexOf(player.direction), 0]}
    >
      <mesh>
        <boxGeometry args={[4, 1, 1]} />
        <meshStandardMaterial color="#38c168" />
      </mesh>
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#38c168" />
      </mesh>
    </group>
  );
}
