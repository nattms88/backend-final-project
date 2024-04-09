import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import UserModel from "../models/UserModels.js";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const usersPath = "./src/data/users.json";
class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find();
            return res.json(users);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
    ;
    async getUserById(req, res) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            return res.json(user);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
    ;
    async registerUser(req, res) {
        try {
            const { username, email, password, role } = req.body;
            const foundUser = await UserModel.findOne({ email });
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            if (foundUser) {
                return res.status(400).json({ error: 'User already exists.' });
            }
            const newUser = new UserModel({
                username,
                email,
                password: bcrypt.hashSync(password.trim(), 7),
                role
            });
            await newUser.save();
            const payload = {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role
            };
            const token = jwt.sign(payload, String(SECRET_KEY));
            newUser.password = "";
            return res.status(201).json({ user: newUser, accessToken: token });
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    ;
    async loginUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            const foundUser = await UserModel.findOne({ email });
            if (!foundUser) {
                return res.status(404).json({ error: 'User not found.' });
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                return res.status(400).json({ error: 'Invalid password.' });
            }
            const payload = {
                id: foundUser._id,
                email: foundUser.email,
                username: foundUser.username,
                role: foundUser.role
            };
            foundUser.password = "";
            const token = jwt.sign(payload, String(SECRET_KEY));
            return res.json({ user: foundUser, accessToken: token });
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    ;
    async updateUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const userId = req.params.id;
            const { username, email, password, role } = req.body;
            const updatedUser = await UserModel.findById(userId);
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found.' });
            }
            updatedUser.username = username;
            updatedUser.email = email;
            updatedUser.password = bcrypt.hashSync(password.trim(), 7);
            updatedUser.role = role;
            await updatedUser.save();
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
    ;
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const deletedUser = await UserModel.findByIdAndDelete(userId);
            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found.' });
            }
            return res.json({ message: "User deleted successfully!" });
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
    ;
    async searchUsers(req, res) {
        try {
            const { query, page = 1, limit = 10 } = req.query;
            const regex = new RegExp(query, 'i');
            const users = await UserModel
                .find({
                $or: [{ username: regex }, { email: regex }, { role: regex }],
            })
                .skip((page - 1) * limit)
                .limit(limit);
            return res.json(users);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
}
export default new UserController;
//# sourceMappingURL=UserController.js.map