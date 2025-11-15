import type WebSocket from "ws";
import { MESSAGE_TYPE } from "../../constants/constants.js";
import { sendMessage } from "../../utils/sendMessage/sendMessage.js";

export function handleAddUserMessage(ws: WebSocket) {
  sendMessage({
    type: MESSAGE_TYPE.add_user_to_room,
    data: {
      roomId: 1,
      roomUsers: [
        {
          indexRoom: 1,
          index: 0,
        },
      ],
    },

    ws,
  });
}
