import { MESSAGE_TYPE } from "../../constants/constants.js";
import { database } from "../../db/database.js";
import { sendMessage } from "./sendMessage.js";

export function sendUpdateWinnersMessage() {
  const users = database.getUsers();
  const winnersData = database.getWinners();
  for (const user of users) {
    const userData = user[1];
    sendMessage({
      type: MESSAGE_TYPE.update_winners,
      data: winnersData,
      ws: userData.ws,
    });
  }
}
