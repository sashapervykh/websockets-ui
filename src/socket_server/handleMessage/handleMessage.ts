import { MESSAGE_TYPE } from "../../constants/constants.js";
import { checkMessageType } from "../../utils/checkMessageType.js";
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
      handleRegMessage(typedMessage, ws);
      break;
    }
    default: {
      console.log(message);
      console.error(`Message with the unknown type was received: ${message}`);
    }
  }
}
