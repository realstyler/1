import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { usersService } from "../users/users.service.js";
import mapUser from "../utils/mapUser.util.js";
import { quotaService } from "../quota/quota.service.js";

class AuthController {
  register = async (req: any, res: Response) => {
    const user = await authService.register(req.body);
    req.session.userId = user.id;

    const forwardedFor = req.headers["x-forwarded-for"];
    const ipString = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(",")[0];
    const ip: string = ipString || req.socket.remoteAddress || "unknown_ip";

    const migratedCount = await quotaService.migrateGuestQuotaToUser(ip, user.id);

    if (migratedCount === 0) {
      await quotaService.createFreePeriod({ type: "user", id: user.id });
    }

    const fullUser = await usersService.getUserById(user.id);
    
    res.json(mapUser(fullUser));
  };

  login = async (req: any, res: Response) => {
    const user = await authService.login(req.body);
    req.session.userId = user.id;
    const fullUser = await usersService.getUserById(user.id);
    res.json(mapUser(fullUser));
  };

  logout = (req: Request, res: Response) => {
    req.session.destroy((err: any) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.clearCookie("connect.sid");
      res.status(200).end();
    });
  };

  me = async (req: any, res: any) => {
    const user = await usersService.getUserById(req.session.userId);
    res.json(mapUser(user));
  };
}

export const authController = new AuthController();
