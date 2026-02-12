import { Router, type Router as ExpressRouter } from "express";
import { aiGenerationController } from "./ai-generation.controller.js";
import { sessionUser } from "../middlewares/sessionUser.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const aiGenerationRouter: ExpressRouter = Router();

aiGenerationRouter.post(
  "/restyle",
  requireAuth,
  sessionUser,
  aiGenerationController.restyle,
);
aiGenerationRouter.get("/restyle/jobs", aiGenerationController.getJobs);
aiGenerationRouter.get("/restyle/:jobId", aiGenerationController.getJobById);

export default aiGenerationRouter;
