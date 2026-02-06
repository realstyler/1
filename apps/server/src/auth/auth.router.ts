import { Router, type Router as ExpressRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { userService } from "../user/user.service.js";
import { authController } from "./auth.controller.js";

const authRouter: ExpressRouter = Router();

authRouter.post("/auth/register", authController.register);
authRouter.post("/auth/login", authController.login);
authRouter.post("/auth/logout", authController.logout);

authRouter.get("/auth/me", requireAuth, async (req: any, res) => {
  console.log(req.session);
  const user = await userService.getUserById(req.session.userId);
  res.json({ user });
});

export default authRouter;
