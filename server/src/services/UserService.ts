import { IUser } from "../interfaces/interfaces.js";
import jsonFileReader from "../utils/jsonFileReader.js";

const usersPath = "./src/data/users.json";

class UserService {
  getAll(): IUser[] {
    return jsonFileReader.readFileJson(usersPath);
  }

  getOne(userId: number): IUser | undefined {
    const users: IUser[] = jsonFileReader.readFileJson(usersPath);
    return users.find((user) => user.id === userId);
  }

  create(userData: any, posterFile: any): IUser {
    const { username, email, password, role } = userData;
    const users: IUser[] = jsonFileReader.readFileJson(usersPath);
    const lastId = users.length > 0 ? users[users.length - 1].id : 0;


    const newUser: IUser = {
      id: lastId + 1,
      username,
      email,
      password,
      role,
    };
    
    users.push(newUser);
    jsonFileReader.writeFileJson(usersPath, users);
    return newUser;
  }

  update(
    userData: any,
    userId: number,
  ): IUser | undefined {
    const { username, email, password, role } = userData;
    const users: IUser[] = jsonFileReader.readFileJson(usersPath);
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) return undefined;

    const updatedUser: IUser = {
      id: userId,
      username,
      email,
      password,
      role
     
    };
    users[userIndex] = updatedUser;
    jsonFileReader.writeFileJson(usersPath, users);
    return updatedUser;
  }

  delete(userId: number): IUser | undefined {
    const users: IUser[] = jsonFileReader.readFileJson(usersPath);
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return undefined;
    }
    const deletedUser = users.splice(userIndex, 1);

    jsonFileReader.writeFileJson(usersPath, users);

    return deletedUser[0];
  }
}

export default new UserService();
