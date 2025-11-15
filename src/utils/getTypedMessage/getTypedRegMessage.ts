import { MESSAGE_TYPE } from "../../constants/constants.js";
import type { MessageWithCheckedType } from "../../model/message.js";

export function getTypedRegMessage(message: MessageWithCheckedType) {
  if (message["type"] !== MESSAGE_TYPE.reg) {
    throw new Error(
      `Property message has type ${message.type}, not type reg as expected!`
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

  const data = JSON.parse(message["data"]);

  if (
    !(
      typeof data === "object" &&
      data &&
      "name" in data &&
      "password" in data &&
      data["name"] &&
      data["password"] &&
      typeof data["name"] === "string" &&
      typeof data["password"] === "string"
    )
  ) {
    throw new Error("Data property has the wrong type!");
  }
  if (typeof message["id"] !== "number") {
    throw new Error("Id property has the wrong type!");
  }

  return {
    type: message.type,
    data: { name: data.name, password: data.password },
    id: message.id,
  };
}
