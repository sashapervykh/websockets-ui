import type WebSocket from "ws";
import type { ShipMessage, ShipStored } from "../model/message.js";
import { createDbShipData } from "../utils/createDbShipData.js";

interface UserData {
  name: string;
  password: string;
}

interface StoredUserData {
  name: string;
  password: string;
  index: number;
  wins: number;
  ws: WebSocket;
}

interface RoomData {
  roomId: number;
  roomUsers: StoredUserData[];
}

type GameUserData = StoredUserData & { shipsReceived: ShipMessage[] } & {
  shipsStored: ShipStored[];
};

class Database {
  users: StoredUserData[] = [];
  rooms = new Map<number, RoomData>();
  games = new Map<number, GameUserData[]>();
  userIndex = 0;
  roomsIndex = 0;
  gameIndex = 0;

  addUser(user: UserData, ws: WebSocket) {
    const existingUser = this.users.find(
      (storedUser) => storedUser.name === user.name
    );

    if (existingUser) {
      if (existingUser.password !== user.password)
        throw new Error("Wrong password received!");
      existingUser.ws = ws;
      return existingUser;
    }

    const storedUser = {
      ...user,
      index: this.userIndex,
      wins: 0,
      ws,
    };

    this.users.push(storedUser);
    this.userIndex++;
    return storedUser;
  }

  addUserToGame(user: StoredUserData, ships: ShipMessage[], idGame: number) {
    const game = this.games.get(idGame);
    if (!game) return;
    const shipsStored = createDbShipData(ships);
    game.push({ ...user, shipsReceived: ships, shipsStored: shipsStored });
  }

  addUserToRoom(user: StoredUserData, indexRoom: number) {
    const room = this.rooms.get(indexRoom);
    if (!room) return;
    room.roomUsers.push(user);
  }

  createRoom(user: StoredUserData) {
    this.rooms.set(this.roomsIndex, {
      roomId: this.roomsIndex,
      roomUsers: [user],
    });
    this.roomsIndex++;
  }

  createGame() {
    this.games.set(this.gameIndex, []);
    return this.gameIndex++;
  }

  deleteGame(gameId: number) {
    this.games.delete(gameId);
  }

  getGame(idGame: number) {
    return this.games.get(idGame);
  }

  getUser(ws: WebSocket) {
    return this.users.find((elem) => elem.ws === ws);
  }

  getUsers() {
    return this.users;
  }

  getRooms() {
    return Array.from(this.rooms.values())
      .filter((elem) => elem.roomUsers.length < 2)
      .map((elem) => ({
        roomId: elem.roomId,
        roomUsers: elem.roomUsers.map((elem) => ({
          name: elem.name,
          index: elem.index,
        })),
      }));
  }

  getRoomUsers(indexRoom: number) {
    const roomUsers = this.rooms.get(indexRoom)?.roomUsers;
    return roomUsers;
  }

  getWinners() {
    return Array.from(this.users.values()).map((elem) => ({
      name: elem.name,
      wins: elem.wins,
    }));
  }

  updateWinners(ws: WebSocket) {
    const user = this.getUser(ws);
    if (!user) return;
    user.wins++;
  }
}

export const database = new Database();
