import type WebSocket from "ws";
import type { ShipMessage, ShipStored } from "../model/message.js";
import { createDbShipData } from "../utils/createDbShipData.js";

interface UserData {
  name: string;
}

interface StoredUserData {
  name: string;
  index: number;
  wins: number;
  ws: WebSocket;
}

type WinsUserData = Omit<StoredUserData, "index" | "ws">;

interface RoomData {
  roomId: number;
  roomUsers: StoredUserData[];
}

type GameUserData = StoredUserData & { shipsReceived: ShipMessage[] } & {
  shipsStored: ShipStored[];
};

class Database {
  users = new Map<WebSocket, StoredUserData>();
  rooms = new Map<number, RoomData>();
  games = new Map<number, GameUserData[]>();
  userIndex = 0;
  roomsIndex = 0;
  gameIndex = 0;

  addUser(user: UserData, ws: WebSocket) {
    const storedUser = {
      ...user,
      index: this.userIndex,
      wins: 0,
      ws,
    };
    this.users.set(ws, storedUser);
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

  getGame(idGame: number) {
    return this.games.get(idGame);
  }

  getUser(ws: WebSocket) {
    return this.users.get(ws);
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
}

export const database = new Database();
