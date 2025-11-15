import { MESSAGE_TYPE } from "../../constants/constants.js";
import { database } from "../../db/database.js";
import { sendMessage } from "./sendMessage.js";

interface AttackData {
  position: { x: number; y: number };
  currentPlayer: number;
  status: string;
}

export function sendAttackMessage(gameId: number, attackData: AttackData) {
  const gameUsers = database.getGame(gameId);
  if (!gameUsers) return;
  console.log(attackData);
  for (const user of gameUsers) {
    sendMessage({
      type: MESSAGE_TYPE.attack,
      data: attackData,
      ws: user.ws,
    });
  }
}
