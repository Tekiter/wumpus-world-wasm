import { useAtomValue } from "jotai";
import { worldData, worldDiscovered } from "../../states";

const CELL_SIZE = 5;
const CELL_GAP = 0.5;

function getGridPosition(y: number, x: number) {
  const xPos = (x - 3 + 1 / 2) * (CELL_SIZE + CELL_GAP);
  const yPos = (y - 3 + 1 / 2) * (CELL_SIZE + CELL_GAP);

  return {
    xPos,
    yPos,
  };
}

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
