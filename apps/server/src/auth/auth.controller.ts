import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { userService } from "../user/user.service.js";

class AuthController {
  register = async (req: any, res: Response) => {
    const user = await authService.register(req.body);
    req.session.userId = user.id;
    res.json(user);
  };

  login = async (req: any, res: Response) => {
    const user = await authService.login(req.body);
    req.session.userId = user.id;
    res.json(user);
  };

  logout = (req: Request, res: Response) => {
    req.session.destroy((err: any) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.clearCookie("connect.sid");
      res.status(200).end();
    });
  };

  me = async (req: any, res: any) => {
    const user = await userService.getUserById(req.session.userId);
    res.json(user);
  };
}

export const authController = new AuthController();
