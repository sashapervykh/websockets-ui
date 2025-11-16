import type { ShipMessage } from "../model/message.js";

export function createDbShipData(ships: ShipMessage[]) {
  return ships.map((ship) => {
    const cells = getCells(
      ship.position.x,
      ship.position.y,
      ship.length,
      ship.direction
    );
    const surrounding = getSurroundingCells(
      ship.position.x,
      ship.position.y,
      ship.length,
      ship.direction
    );
    return { cells, surrounding, length: ship.length, shot: 0, killed: false };
  });
}

function getCells(x: number, y: number, length: number, direction: boolean) {
  const cells = new Map<number, number[]>();

  let nextX = x;
  let nextY = y;
  for (let i = 0; i < length; i++) {
    if (cells.has(nextX)) {
      const coordinates = cells.get(nextX);
      coordinates?.push(nextY);
    } else {
      cells.set(nextX, [nextY]);
    }
    if (direction) {
      nextY++;
    } else {
      nextX++;
    }
  }

  return cells;
}

function getSurroundingCells(
  startX: number,
  startY: number,
  length: number,
  direction: boolean
) {
  const res = [];

  const xLimit = direction ? startX + 1 : startX + length;
  const yLimit = direction ? startY + length : startY + 1;

  for (let x = startX - 1; x <= xLimit; x++) {
    for (let y = startY - 1; y <= yLimit; y++) {
      if (x < 0 || x > 9 || y < 0 || y > 9) continue;
      if (
        direction &&
        x === startX &&
        y !== startY - 1 &&
        y !== startY + length
      )
        continue;
      if (
        !direction &&
        y === startY &&
        x !== startX - 1 &&
        x !== startX + length
      )
        continue;
      res.push({ x, y });
    }
  }
  return res;
}
