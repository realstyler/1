import { Router, type Router as ExpressRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { sessionUser } from "../middlewares/sessionUser.js";
import { projectsController } from "./projects.controller.js";

const projectsRouter: ExpressRouter = Router();

projectsRouter.post(
  "/projects",
  requireAuth,
  sessionUser,
  projectsController.create,
);

projectsRouter.post(
  "/projects/share",
  requireAuth,
  sessionUser,
  projectsController.share,
);

projectsRouter.get(
  "/projects/:id",
  requireAuth,
  sessionUser,
  projectsController.getById,
);

projectsRouter.delete(
  "/projects/:id",
  requireAuth,
  sessionUser,
  projectsController.delete,
);

projectsRouter.get(
  "/projects/public/:shareId",
  projectsController.getByShareId,
);

export default projectsRouter;
