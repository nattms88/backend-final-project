import { validationResult } from "express-validator";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModels.js";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const usersPath = "./src/data/users.json";

class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        return res
          .status(403)
          .json({
            error: "Forbidden access. Only ADMIN can access all users.",
          });
      }
      const users = await UserModel.find();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async registerUser(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;

      const foundUser = await UserModel.findOne({ email });

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      if (foundUser) {
        return res.status(400).json({ error: "User already exists." });
      }

      const newUser = new UserModel({
        username,
        email,
        password: bcrypt.hashSync(password.trim(), 7),
        role,
      });

      await newUser.save();

      const payload = {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      };

      const token = jwt.sign(payload, String(SECRET_KEY));

      newUser.password = "";

      return res.status(201).json({ user: newUser, accessToken: token });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      const foundUser = await UserModel.findOne({ email });

      if (!foundUser) {
        return res.status(404).json({ error: "User not found." });
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        return res.status(400).json({ error: "Invalid password." });
      }

      const payload = {
        id: foundUser._id,
        email: foundUser.email,
        username: foundUser.username,
        role: foundUser.role,
      };

      foundUser.password = "";

      const token = jwt.sign(payload, String(SECRET_KEY));

      return res.json({ user: foundUser, accessToken: token });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Forbidden access. Only ADMIN can update users." });
      }

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const userId = req.params.id;
      const { username, email, password, role } = req.body;
      const updatedUser = await UserModel.findById(userId);

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found." });
      }

      updatedUser.username = username;
      updatedUser.email = email;
      updatedUser.password = bcrypt.hashSync(password.trim(), 7);
      updatedUser.role = role;

      await updatedUser.save();

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden access. Only ADMIN can delete users.' });
      }

      const userId = req.params.id;
      const deletedUser: any = await UserModel.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: "User not found." });
      }

      return res.json({ message: "User deleted successfully!" });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error.' });
    }
  }
}

export default new UserController();
