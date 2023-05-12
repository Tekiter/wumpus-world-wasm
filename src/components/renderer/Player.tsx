import { useAtomValue } from "jotai";
import { getGridPosition } from "./position";
import { playerData } from "../../states";
import { motion } from "framer-motion-3d";
import { useSpring } from "framer-motion";
import { useEffect } from "react";

const dirCycle = ["E", "S", "W", "N"] as const;

export function Player() {
  const player = useAtomValue(playerData);
  const { xPos, yPos } = getGridPosition(player.y, player.x);
  const rotationValue = useSpring(0, {
    bounce: 0,
  });

  useEffect(() => {
    const prevAngle = rotationValue.get() as number;
    const idx = dirCycle.indexOf(player.direction);
    const angle = (Math.PI / 2) * -idx;
    const diff = angle - prevAngle;

    if (diff > Math.PI) {
      rotationValue.jump(prevAngle + 2 * Math.PI);
    } else if (diff < -Math.PI) {
      rotationValue.jump(prevAngle - 2 * Math.PI);
    }

    rotationValue.set(angle);
  }, [player.direction, rotationValue]);

  return (
    <motion.group
      rotation={[0, rotationValue, 0]}
      initial={{
        x: xPos,
        y: 2,
        z: yPos,
      }}
      animate={{
        x: xPos,
        y: 2,
        z: yPos,

        transition: { restDelta: 0.0001 },
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[4, 1, 1]} />
        <meshStandardMaterial color="#38c168" />
      </mesh>
      <mesh position={[1, 0, 0]} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#38c168" />
      </mesh>
    </motion.group>
  );
}
