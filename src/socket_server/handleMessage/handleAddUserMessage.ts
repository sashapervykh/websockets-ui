import type WebSocket from "ws";
import type { MessageWithCheckedType } from "../../model/message.js";
import { getTypedAddUserMessage } from "../../utils/getTypedAddUserMessage.js";
import { database } from "../../db/database.js";
import { sendUpdateRoomMessage } from "../../utils/sendMessage/sendUpdateRoomMessage.js";
import { sendMessage } from "../../utils/sendMessage/sendMessage.js";
import { create } from "domain";
import { MESSAGE_TYPE } from "../../constants/constants.js";

export function handleAddUserMessage(
  message: MessageWithCheckedType,
  ws: WebSocket
) {
  try {
    const indexRoom = getTypedAddUserMessage(message).data.indexRoom;
    const user = database.getUser(ws);
    if (!user) return;
    database.addUserToRoom(user, indexRoom);
    const roomUsers = database.getRoomUsers(indexRoom);
    if (!roomUsers) return;
    sendUpdateRoomMessage();
    for (const roomUser of roomUsers) {
      sendMessage({
        type: MESSAGE_TYPE.create_game,
        data: { idGame: 1, idPlayer: roomUser.index },
        ws: roomUser.ws,
      });
    }
  } catch (err) {
    console.error(err);
  }
}
