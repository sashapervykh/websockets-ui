import type WebSocket from "ws";
import type { MessageWithCheckedType } from "../../model/message.js";
import { getTypedRegMessage } from "../../utils/getTypedMessage/getTypedRegMessage.js";
import { database } from "../../db/database.js";
import { MESSAGE_TYPE } from "../../constants/constants.js";
import { sendMessage } from "../../utils/sendMessage/sendMessage.js";
import { sendUpdateRoomMessage } from "../../utils/sendMessage/sendUpdateRoomMessage.js";
import { sendUpdateWinnersMessage } from "../../utils/sendMessage/sendUpdateWinnersMessage.js";

export function handleRegMessage(
  message: MessageWithCheckedType,
  ws: WebSocket
) {
  try {
    const typedMessage = getTypedRegMessage(message);
    const storedUser = database.addUser({ name: typedMessage.data.name }, ws);
    const data = {
      name: storedUser.name,
      index: storedUser.index,
      error: false,
    };
    sendMessage({ type: MESSAGE_TYPE.reg, data, ws });
    sendUpdateRoomMessage();
    sendUpdateWinnersMessage();
  } catch (err) {
    if (err instanceof Error) {
      sendMessage({
        type: MESSAGE_TYPE.reg,
        data: { error: true, errorText: err.message },
        ws,
      });
      return;
    }
    sendMessage({
      type: MESSAGE_TYPE.reg,
      data: { error: true, errorText: "Unexpected error happened!" },
      ws,
    });
  }
}
