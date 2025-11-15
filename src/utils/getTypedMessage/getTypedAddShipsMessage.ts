import { MESSAGE_TYPE } from "../../constants/constants.js";
import type { MessageWithCheckedType } from "../../model/message.js";

export function getTypedAddShipsMessage(message: MessageWithCheckedType) {
  if (message["type"] !== MESSAGE_TYPE.add_ships) {
    throw new Error(
      `Property message has type ${message.type}, not type add_ships as expected!`
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
      "ships" in data &&
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
      ships: data.ships,
      indexPlayer: data.indexPlayer,
    },
    id: message.id,
  };
}

function getTypedShips(ships: unknown) {
  if (typeof ships !== "string") {
    throw new Error(`Received ships is not string!`);
  }
  const shipsObj: unknown = JSON.parse(ships);
  if (typeof shipsObj !== "object" || !shipsObj) {
    throw new Error(`Ships are not valid JSON!`);
  }
  if (!Array.isArray(shipsObj)) {
    throw new Error(`Ships are not an array!`);
  }
  const res = [];
}

function getTypedShip(ship: unknown) {
  if (typeof ship !== "object" || !ship) {
    throw new Error(`Ship is not valid JSON!`);
  }
  if (!("direction" in ship && typeof ship["direction"] === "boolean"))
    throw new Error("Direction property of some ships is not boolean");
  if (!("length" in ship && typeof ship["direction"] === "number"))
    throw new Error("Length property of some ships is not a number");
  if (!("type" in ship && typeof ship["type"] === "string"))
    throw new Error("Type property of some ships is not string");
  if (
    !(
      "position" in ship &&
      typeof ship["position"] === "object" &&
      ship["position"] &&
      "x" in ship["position"] &&
      "y" in ship["position"] &&
      typeof ship["position"]["x"] === "number" &&
      typeof ship["position"]["y"] === "number"
    )
  )
    throw new Error("Position property of some ships is not a valid object");

  return {
    direction: ship.direction,
    length: ship.length,
    type: ship.type,
    position: { x: ship.position.x, y: ship.position.y },
  };
}
