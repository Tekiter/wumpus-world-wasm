export const CELL_SIZE = 5;
export const CELL_GAP = 0.5;

export function getGridPosition(y: number, x: number) {
  const xPos = (x - 3 + 1 / 2) * (CELL_SIZE + CELL_GAP);
  const yPos = (y - 3 + 1 / 2) * (CELL_SIZE + CELL_GAP);

  return {
    xPos,
    yPos: -yPos,
  };
}
