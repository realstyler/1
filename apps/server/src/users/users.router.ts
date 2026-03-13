import { Router } from "express";
import { usersController } from "./users.controller.js";

const usersRouter : Router = Router();

usersRouter.patch("/users/avatar", usersController.updateAvatar);
export default usersRouter;