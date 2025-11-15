import { MESSAGE_TYPE } from "../../constants/constants.js";
import { database } from "../../db/database.js";
import { sendMessage } from "./sendMessage.js";

export function sendUpdateRoomMessage() {
  const users = database.getUsers();
  const roomsData = database.getRooms();
  for (const user of users) {
    const userData = user[1];
    sendMessage({
      type: MESSAGE_TYPE.update_room,
      data: roomsData,
      ws: userData.ws,
    });
  }
}
