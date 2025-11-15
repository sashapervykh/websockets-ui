import type WebSocket from "ws";
import type { MessageWithCheckedType } from "../../model/message.js";
import { database } from "../../db/database.js";
import { sendUpdateRoomMessage } from "../../utils/sendMessage/sendUpdateRoomMessage.js";
import { sendMessage } from "../../utils/sendMessage/sendMessage.js";
import { MESSAGE_TYPE } from "../../constants/constants.js";
import { getTypedAddShipsMessage } from "../../utils/getTypedMessage/getTypedAddShipsMessage.js";
import { stringify } from "querystring";

export function handleAddShipsMessage(
  message: MessageWithCheckedType,
  ws: WebSocket
) {
  const { gameId, ships } = getTypedAddShipsMessage(message).data;
  const user = database.getUser(ws);
  database.addUserToGame(user, ships, gameId);
  const gameUsers = database.getGame(gameId);
  if (!gameUsers) return;
  if (gameUsers.length === 2) {
    for (const gameUser of gameUsers) {
      sendMessage({
        type: MESSAGE_TYPE.start_game,
        data: JSON.stringify({ ships, currentPlayerIndex: gameUser.index }),
        ws: gameUser.ws,
      });
    }
  }
}
