import type WebSocket from "ws";
import type {
  MessageWithCheckedType,
  ShipStored,
} from "../../model/message.js";
import { getTypedAttackMessage } from "../../utils/getTypedMessage/getTypedAttackMessage.js";
import { database } from "../../db/database.js";
import { sendAttackMessage } from "../../utils/sendMessage/sendAttackMessage.js";

export function handleAttackMessage(
  message: MessageWithCheckedType,
  ws: WebSocket
) {
  const { x, y, gameId, indexPlayer } = getTypedAttackMessage(message).data;
  const game = database.getGame(gameId);
  if (!game) return;
  const user = game.filter((elem) => elem.index !== indexPlayer)[0];
  if (!user) return;

  const attackData = {
    position: { x, y },
    currentPlayer: indexPlayer,
    status: "miss",
  };
  for (const ship of user.shipsStored) {
    const isShot = checkShot(x, y, ship);
    if (isShot) {
      ship.shot++;
      ship.killed = ship.length - ship.shot === 0 ? true : false;
      attackData.status = ship.killed ? "killed" : "shot";
      break;
    }
  }
  sendAttackMessage(gameId, attackData);
}

function checkShot(x: number, y: number, ship: ShipStored) {
  if (!ship.cells.has(x)) {
    return false;
  }
  const yCells = ship.cells.get(x);
  if (!yCells) return;
  return yCells.some((elem) => elem === y);
}
