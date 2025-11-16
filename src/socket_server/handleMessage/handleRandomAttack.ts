import { MESSAGE_TYPE } from "../../constants/constants.js";
import type { MessageWithCheckedType } from "../../model/message.js";
import { getTypedRandomAttackMessage } from "../../utils/getTypedMessage/getTypedRandomAttacl.js";
import { handleAttackMessage } from "./handleAttackMessage.js";

export function handleRandomAttack(message: MessageWithCheckedType) {
  const { gameId, indexPlayer } = getTypedRandomAttackMessage(message).data;
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  handleAttackMessage({
    type: MESSAGE_TYPE.attack,
    data: `{ "gameId": ${gameId}, "indexPlayer": ${indexPlayer}, "x": ${x}, "y": ${y} }`,
    id: 0,
  });
}
