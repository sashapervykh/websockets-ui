import type WebSocket from "ws";
import { sendMessage } from "../../utils/sendMessage/sendMessage.js";
import { MESSAGE_TYPE } from "../../constants/constants.js";

export function handleSinglePlayMessage(ws: WebSocket) {
  sendMessage({
    type: MESSAGE_TYPE.create_game,
    data: { idGame: 1, idPlayer: 0 },
    ws: ws,
  });
}
