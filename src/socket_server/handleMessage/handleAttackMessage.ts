import type WebSocket from "ws";
import type {
  MessageWithCheckedType,
  ShipStored,
} from "../../model/message.js";
import { getTypedAttackMessage } from "../../utils/getTypedMessage/getTypedAttackMessage.js";
import { database } from "../../db/database.js";
import { sendAttackMessage } from "../../utils/sendMessage/sendAttackMessage.js";
import { MESSAGE_TYPE } from "../../constants/constants.js";
import { sendMessage } from "../../utils/sendMessage/sendMessage.js";
import { sendUpdateWinnersMessage } from "../../utils/sendMessage/sendUpdateWinnersMessage.js";

export function handleAttackMessage(
  message: MessageWithCheckedType,
  ws: WebSocket
) {
  const { x, y, gameId, indexPlayer } = getTypedAttackMessage(message).data;
  const game = database.getGame(gameId);
  if (!game) return;
  const enemy = game.filter((elem) => elem.index !== indexPlayer)[0];

  if (!enemy) return;
  let cellsToMissWhenKilled: { x: number; y: number }[] | undefined;
  const attackData = {
    position: { x, y },
    currentPlayer: indexPlayer,
    status: "miss",
  };
  for (const ship of enemy.shipsStored) {
    const isShot = checkShot(x, y, ship);
    if (isShot) {
      ship.shot++;
      ship.killed = ship.length - ship.shot === 0 ? true : false;
      attackData.status = ship.killed ? "killed" : "shot";
      if (ship.killed) cellsToMissWhenKilled = ship.surrounding;
      break;
    }
  }
  sendAttackMessage(gameId, attackData);
  if (cellsToMissWhenKilled) {
    for (const cell of cellsToMissWhenKilled) {
      const missedAttackData = {
        position: { x: cell.x, y: cell.y },
        currentPlayer: indexPlayer,
        status: "miss",
      };
      sendAttackMessage(gameId, missedAttackData);
    }
  }

  if (attackData.status === "killed") {
    for (const user of game) {
      sendMessage({
        type: MESSAGE_TYPE.attack,
        data: attackData,
        ws: user.ws,
      });
    }
    for (const user of game) {
      if (enemy.shipsStored.every((elem) => elem.killed)) {
        sendMessage({
          type: MESSAGE_TYPE.finish,
          data: { winPlayer: indexPlayer },
          ws: user.ws,
        });
        database.deleteGame(gameId);
        database.updateWinners(ws);
        console.log(database.getUser(ws));
        sendUpdateWinnersMessage();
      }
    }
  }

  const queue = attackData.status === "miss" ? enemy.index : indexPlayer;

  for (const user of game) {
    sendMessage({
      type: MESSAGE_TYPE.turn,
      data: { currentPlayer: queue },
      ws: user.ws,
    });
  }
}

function checkShot(x: number, y: number, ship: ShipStored) {
  if (!ship.cells.has(x)) {
    return false;
  }
  const yCells = ship.cells.get(x);
  if (!yCells) return;
  return yCells.some((elem) => elem === y);
}
