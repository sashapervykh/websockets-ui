import { MESSAGE_TYPE } from "../../constants/constants.js";
import type { MessageWithCheckedType } from "../../model/message.js";

export function getTypedRandomAttackMessage(message: MessageWithCheckedType) {
  if (message["type"] !== MESSAGE_TYPE.randomAttack) {
    throw new Error(
      `Property message has type ${message.type}, not type randomAttack as expected!`
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
      "gameId" in data &&
      "indexPlayer" in data &&
      typeof data["indexPlayer"] === "number" &&
      typeof data["gameId"] === "number"
    )
  ) {
    throw new Error("Data property has the wrong type!");
  }
  if (typeof message["id"] !== "number") {
    throw new Error("Id property has the wrong type!");
  }

  return {
    type: message.type,
    data: {
      gameId: data.gameId,
      indexPlayer: data.indexPlayer,
    },
    id: message.id,
  };
}
