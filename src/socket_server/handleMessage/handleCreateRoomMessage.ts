import type WebSocket from "ws";
import { database } from "../../db/database.js";
import { sendUpdateRoomMessage } from "../../utils/sendMessage/sendUpdateRoomMessage.js";

export function handleCreateRoomMessage(ws: WebSocket) {
  const user = database.getUser(ws);
  if (!user) return;
  database.createRoom(user);

  sendUpdateRoomMessage();
}
