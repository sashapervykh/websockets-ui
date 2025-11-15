import type { MessageWithCheckedType } from "../../model/message.js";
import { getTypedRegMessage } from "../../utils/getTypedRegMessage.js";
import { database } from "../../db/database.js";
import { MESSAGE_TYPE } from "../../constants/constants.js";
import { sendMessage } from "../../utils/sendMessage.js";
import type WebSocket from "ws";

export function handleRegMessage(
  message: MessageWithCheckedType,
  ws: WebSocket
) {
  try {
    const typedMessage = getTypedRegMessage(message);
    const storedUser = database.addUser({ ...typedMessage.data });
    const data = {
      name: storedUser.name,
      index: storedUser.index,
      error: false,
    };
    sendMessage({ type: MESSAGE_TYPE.reg, data, ws });
  } catch (err) {
    if (err instanceof Error) {
      sendMessage({
        type: MESSAGE_TYPE.reg,
        data: { error: true, errorText: err.message },
        ws,
      });
      return;
    }
    sendRegMessage({
      type: MESSAGE_TYPE.reg,
      data: { error: true, errorText: "Unexpected error happened!" },
      ws,
    });
  }
}
