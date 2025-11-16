import { MESSAGE_TYPE } from "../../constants/constants.js";
import type { MessageWithCheckedType } from "../../model/message.js";

export function getTypedAddUserMessage(message: MessageWithCheckedType) {
  if (message["type"] !== MESSAGE_TYPE.add_user_to_room) {
    throw new Error(
      `Property message has type ${message.type}, not type add_user_to_room as expected!`
    );
  }
  if (!("data" in message)) {
    throw new Error("Message does not have data property!");
  }
  if (!("id" in message)) {
    throw new Error("Message does not have id property!");
  }

  if (typeof message["data"] !== "string") {
    throw new Error("Data property of received message is not stringified!");
  }

  const data: unknown = JSON.parse(message["data"]);

  if (
    !(
      typeof data === "object" &&
      data &&
      "indexRoom" in data &&
      typeof data["indexRoom"] === "number"
    )
  ) {
    throw new Error("Data property has the wrong type!");
  }
  if (typeof message["id"] !== "number") {
    throw new Error("Id property has the wrong type!");
  }

  return {
    type: message.type,
    data: { indexRoom: data.indexRoom },
    id: message.id,
  };
}
