import { useAtomValue } from "jotai";
import { playerData, worldData, worldDiscovered } from "../../states";
import { CELL_SIZE, getGridPosition } from "./position";

export function WorldMap() {
  const world = useAtomValue(worldData);
  const discovered = useAtomValue(worldDiscovered);
  const player = useAtomValue(playerData);

  return (
    <group>
      {world.map((line, y) =>
        line.map((cell, x) => {
          const { xPos, yPos } = getGridPosition(y, x);

          if (cell.type === "wall") {
            return (
              <mesh key={`${x}${y}`} position={[xPos, 1 + 1, yPos]}>
                <boxGeometry args={[CELL_SIZE, 2, CELL_SIZE]} />
                <meshStandardMaterial color="#4b4b4b" />
              </mesh>
            );
          }

          const wumpus = (
            <mesh position={[0, 1, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={"red"} />
            </mesh>
          );

          const pitch = (
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={"blue"} />
            </mesh>
          );

          const gold = (
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={"yellow"} />
            </mesh>
          );

          return (
            <group key={`${x}${y}`} position={[xPos, 1 + 0.5, yPos]}>
              <mesh receiveShadow>
                <boxGeometry args={[CELL_SIZE, 1, CELL_SIZE]} />
                <meshStandardMaterial
                  color={discovered[y][x] ? "#c9c9c9" : "#6c6c6c"}
                />
              </mesh>
              {cell.type === "wumpus" && wumpus}
              {cell.type === "pitch" && pitch}
              {cell.type === "gold" && player.gold === 0 && gold}
            </group>
          );
        })
      )}
    </group>
  );
}
