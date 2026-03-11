import { Router, type Router as ExpressRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { sessionUser } from "../middlewares/sessionUser.js";
import { collectionsController } from "./collections.controller.js";

const collectionsRouter: ExpressRouter = Router();

collectionsRouter.post(
  "/projects/:projectId/collections",
  requireAuth,
  sessionUser,
  collectionsController.create,
);

collectionsRouter.get(
  "/projects/:projectId/collections",
  requireAuth,
  sessionUser,
  collectionsController.getAllByProject,
);

collectionsRouter.get(
  "/collections/:id",
  requireAuth,
  sessionUser,
  collectionsController.getById,
);

collectionsRouter.delete(
  "/collections/:id",
  requireAuth,
  sessionUser,
  collectionsController.delete,
);

collectionsRouter.post(
  "/collections/:id/share",
  requireAuth,
  sessionUser,
  collectionsController.share,
);

collectionsRouter.get(
  "/collections/public/:shareId",
  collectionsController.getByShareId,
);

export default collectionsRouter;