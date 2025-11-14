interface UserData {
  name: string;
  password: string;
}

interface StoredUserData {
  name: string;
  password: string;
  index: number;
}

class Database {
  users = new Map<number, StoredUserData>();
  userIndex = 0;

  addUser(user: UserData) {
    const storedUser = { ...user, index: this.userIndex };
    this.users.set(this.userIndex, storedUser);
    return storedUser;
  }
}

export const database = new Database();
