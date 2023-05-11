import { useAtomValue } from "jotai";
import { worldData, worldDiscovered } from "../../states";
import { CELL_SIZE, getGridPosition } from "./position";

export function WorldMap() {
  const world = useAtomValue(worldData);
  const discovered = useAtomValue(worldDiscovered);

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

          return (
            <mesh key={`${x}${y}`} position={[xPos, 1 + 0.5, yPos]}>
              <boxGeometry args={[CELL_SIZE, 1, CELL_SIZE]} />
              <meshStandardMaterial
                color={discovered[y][x] ? "#c9c9c9" : "#6c6c6c"}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}
