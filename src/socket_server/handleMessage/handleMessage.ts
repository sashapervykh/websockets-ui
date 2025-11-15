import { MESSAGE_TYPE } from "../../constants/constants.js";
import { checkMessageType } from "../../utils/checkMessageType.js";
import { handleAddUserMessage } from "./handleAddUserMessage.js";
import { handleCreateRoomMessage } from "./handleCreateRoomMessage.js";
import { handleRegMessage } from "./handleRegMessage.js";
import type WebSocket from "ws";

export function handleMessage(message: unknown, ws: WebSocket) {
  const typedMessage = checkMessageType(message);

  switch (typedMessage.type) {
    case MESSAGE_TYPE.reg: {
      handleRegMessage(typedMessage, ws);
      break;
    }
    case MESSAGE_TYPE.create_room: {
      handleCreateRoomMessage(ws);
      break;
    }
    case MESSAGE_TYPE.add_user_to_room: {
      handleAddUserMessage(typedMessage, ws);
      break;
    }
    default: {
      console.log(message);
      console.error(`Message with the unknown type was received: ${message}`);
    }
  }
}
