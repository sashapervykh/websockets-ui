import { MESSAGE_TYPE } from "../../constants/constants.js";
import { checkMessageType } from "../../utils/checkMessageType.js";
import { handleAddShipsMessage } from "./handleAddShipsMessage.js";
import { handleAddUserMessage } from "./handleAddUserMessage.js";
import { handleAttackMessage } from "./handleAttackMessage.js";
import { handleCreateRoomMessage } from "./handleCreateRoomMessage.js";
import { handleRandomAttack } from "./handleRandomAttack.js";
import { handleRegMessage } from "./handleRegMessage.js";
import type WebSocket from "ws";
import { handleSinglePlayMessage } from "./handleSinglePlayMessage.js";

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
    case MESSAGE_TYPE.add_ships: {
      handleAddShipsMessage(typedMessage, ws);
      break;
    }
    case MESSAGE_TYPE.attack: {
      handleAttackMessage(typedMessage, ws);
      break;
    }
    case MESSAGE_TYPE.randomAttack: {
      handleRandomAttack(typedMessage);
      break;
    }
    case MESSAGE_TYPE.single_play: {
      handleSinglePlayMessage(ws);
      break;
    }
    default: {
      console.log(message);
      console.error(`Message with the unknown type was received: ${message}`);
    }
  }
}
