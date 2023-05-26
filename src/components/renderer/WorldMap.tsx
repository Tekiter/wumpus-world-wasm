import { useAtomValue } from "jotai";
import { motion } from "framer-motion-3d";
import { playerData, removedWumpusAtom, worldDiscovered } from "../../states";
import { CELL_SIZE, getGridPosition } from "./position";
import { worldData } from "../../states/world";
import { WumpusModel } from "../model/Wumpus";
import { Coin } from "./Coin";
import { Suspense, useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

export function WorldMap() {
  const world = useAtomValue(worldData);
  const removedWumpus = useAtomValue(removedWumpusAtom);
  const discovered = useAtomValue(worldDiscovered);
  const player = useAtomValue(playerData);

  const coinRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (coinRef.current) {
      coinRef.current.rotation.y = (Math.PI / 10) * 5 * clock.getElapsedTime();
    }
  });

  const wumpus = (
    <group>
      <WumpusModel rotation={[0, Math.PI / 2 + Math.PI / 4, 0]} scale={1.1} />
    </group>
  );

  const pitch = (
    <mesh position={[0, 0.3, 0]} castShadow>
      <boxGeometry args={[(CELL_SIZE * 3) / 4, 0.5, (CELL_SIZE * 3) / 4]} />
      <meshStandardMaterial color={"#3084de"} />
    </mesh>
  );

  const gold = (
    <group ref={coinRef} rotation={[0, Math.PI / 2, 0]}>
      <Coin position={[-2, 1.3, -2]} scale={0.25} />
    </group>
  );

  return (
    <group>
      {world.map((line, y) =>
        line.map((cell, x) => {
          const { xPos, yPos } = getGridPosition(y, x);

          if (cell.type === "wall") {
            return (
              <mesh key={`${x}${y}`} position={[xPos, 1 + 1, yPos]}>
                <boxGeometry args={[CELL_SIZE, 2, CELL_SIZE]} />
                <motion.meshStandardMaterial
                  initial={{ color: "#4b4b4b" }}
                  animate={{ color: discovered[y][x] ? "#747474" : "#4b4b4b" }}
                />
              </mesh>
            );
          }

          return (
            <group key={`${x}${y}`} position={[xPos, 1 + 0.5, yPos]}>
              <mesh receiveShadow>
                <boxGeometry args={[CELL_SIZE, 1, CELL_SIZE]} />
                <motion.meshStandardMaterial
                  initial={{ color: "#6c6c6c" }}
                  animate={{ color: discovered[y][x] ? "#c9c9c9" : "#6c6c6c" }}
                />
              </mesh>
              <Suspense>
                {cell.type === "wumpus" &&
                  !removedWumpus.find((v) => v.y === y && v.x === x) &&
                  wumpus}
                {cell.type === "pitch" && pitch}
                {cell.type === "gold" && player.gold === 0 && gold}
              </Suspense>
            </group>
          );
        })
      )}
    </group>
  );
}
