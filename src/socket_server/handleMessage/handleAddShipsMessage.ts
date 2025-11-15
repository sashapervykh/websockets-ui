import type WebSocket from "ws";
import type { MessageWithCheckedType } from "../../model/message.js";
import { database } from "../../db/database.js";
import { sendMessage } from "../../utils/sendMessage/sendMessage.js";
import { MESSAGE_TYPE } from "../../constants/constants.js";
import { getTypedAddShipsMessage } from "../../utils/getTypedMessage/getTypedAddShipsMessage.js";

export function handleAddShipsMessage(
  message: MessageWithCheckedType,
  ws: WebSocket
) {
  const { gameId, ships } = getTypedAddShipsMessage(message).data;
  const user = database.getUser(ws);
  if (!user) return;
  database.addUserToGame(user, ships, gameId);
  const gameUsers = database.getGame(gameId);
  if (!gameUsers) return;
  if (gameUsers.length === 2) {
    const nextUser = Math.floor(Math.random() * 2);
    for (const gameUser of gameUsers) {
      sendMessage({
        type: MESSAGE_TYPE.start_game,
        data: {
          ships: gameUser.shipReceived,
          currentPlayerIndex: gameUser.index,
        },
        ws: gameUser.ws,
      });
    }
    for (const gameUser of gameUsers) {
      sendMessage({
        type: MESSAGE_TYPE.turn,
        data: { currentPlayer: gameUsers[nextUser].index },
        ws: gameUser.ws,
      });
    }
  }
}
