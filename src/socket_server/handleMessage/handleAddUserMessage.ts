import type WebSocket from "ws";
import type { MessageWithCheckedType } from "../../model/message.js";
import { getTypedAddUserMessage } from "../../utils/getTypedAddUserMessage.js";
import { database } from "../../db/database.js";
import { sendUpdateRoomMessage } from "../../utils/sendMessage/sendUpdateRoomMessage.js";

export function handleAddUserMessage(
  message: MessageWithCheckedType,
  ws: WebSocket
) {
  try {
    const indexRoom = getTypedAddUserMessage(message).data.indexRoom;
    const user = database.getUser(ws);
    if (!user) return;
    database.addUserToRoom(user, indexRoom);

    sendUpdateRoomMessage();
  } catch (err) {
    console.error(err);
  }
}
