import type { ShipMessage } from "../model/message.js";

export function createDbShipData(ships: ShipMessage[]) {
  return ships.map((ship) => {
    const cells = getCells(
      ship.position.x,
      ship.position.y,
      ship.length,
      ship.direction
    );
    return { cells, length: ship.length, shot: 0, killed: false };
  });
}

function getCells(x: number, y: number, length: number, direction: boolean) {
  const cellsMap = new Map<number, number[]>();
  let nextX = x;
  let nextY = y;
  for (let i = 0; i < length; i++) {
    if (cellsMap.has(nextX)) {
      const coordinates = cellsMap.get(nextX);
      coordinates?.push(nextY);
    } else {
      cellsMap.set(nextX, [nextY]);
    }
    if (direction) {
      nextY++;
    } else {
      nextX++;
    }
  }

  return cellsMap;
}
