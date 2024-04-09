import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../models/UserModels.js";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. No token provided!" })
  }

  try {
    const payload: any = jwt.verify(token, String(process.env.SECRET_KEY));
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Forbidden access. Invalid token." })
  }
}

export function checkRoles(roles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden access. User doesn't have the required role." });
    }

    next();
  }
}
