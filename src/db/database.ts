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

type RoomsUserData = Omit<StoredUserData, "wins" | "ws">;
type WinsUserData = Omit<StoredUserData, "index" | "ws">;

interface RoomData {
  roomId: number;
  roomUsers: RoomsUserData[];
}

class Database {
  users = new Map<WebSocket, StoredUserData>();
  rooms = new Map<number, RoomData>();
  userIndex = 0;
  roomsIndex = 0;

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

  createRoom(user: StoredUserData) {
    this.rooms.set(this.roomsIndex, {
      roomId: this.roomsIndex,
      roomUsers: [{ name: user.name, index: user.index }],
    });
  }

  getUser(ws: WebSocket) {
    return this.users.get(ws);
  }

  getUsers() {
    return this.users;
  }

  getRooms() {
    return Array.from(this.rooms.values()).filter(
      (elem) => elem.roomUsers.length < 2
    );
  }

  getWinners() {
    return Array.from(this.users.values()).map((elem) => ({
      name: elem.name,
      wins: elem.wins,
    }));
  }
}

export const database = new Database();
