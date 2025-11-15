import type WebSocket from "ws";

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

class Database {
  users = new Map<WebSocket, StoredUserData>();
  rooms = new Map<number, RoomData>();
  games = new Map<number, unknown[]>();
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

  addUserToGame(user: StoredUserData, ships: string, idGame: number) {
    const game = this.games.get(idGame);
    if (!game) return;
    game.push({ ...user, ships: ships });
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
