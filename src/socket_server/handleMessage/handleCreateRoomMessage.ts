import type WebSocket from "ws";
import { sendMessage } from "../../utils/sendMessage.js";
import { MESSAGE_TYPE } from "../../constants/constants.js";

export function handleCreateRoomMessage(ws: WebSocket) {
  sendMessage({
    type: MESSAGE_TYPE.add_user_to_room,
    data: {
      indexRoom: 1,
    },
    ws,
  });
  sendMessage({
    type: MESSAGE_TYPE.update_room,
    data: [
      {
        roomId: 1,
        roomUsers: [
          {
            name: "aaaaa",
            index: 0,
          },
        ],
      },
    ],
    ws,
  });
}
