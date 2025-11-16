import { MESSAGE_TYPE } from "../../constants/constants.js";
import { checkMessageType } from "../../utils/checkMessageType.js";
import { handleAddShipsMessage } from "./handleAddShipsMessage.js";
import { handleAddUserMessage } from "./handleAddUserMessage.js";
import { handleAttackMessage } from "./handleAttackMessage.js";
import { handleCreateRoomMessage } from "./handleCreateRoomMessage.js";
import { handleRegMessage } from "./handleRegMessage.js";
import type WebSocket from "ws";

export function handleMessage(message: unknown, ws: WebSocket) {
  const typedMessage = checkMessageType(message);
  console.log(message);

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
    case MESSAGE_TYPE.add_ships: {
      handleAddShipsMessage(typedMessage, ws);
      break;
    }
    case MESSAGE_TYPE.attack: {
      handleAttackMessage(typedMessage);
      break;
    }
    default: {
      console.log(message);
      console.error(`Message with the unknown type was received: ${message}`);
    }
  }
}
