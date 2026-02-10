import { Router, type Router as ExpressRouter } from "express";
import { aiGenerationController } from "./aiGeneration.controller.js";

const aiGenerationRouter: ExpressRouter = Router();

aiGenerationRouter.post("/restyle", aiGenerationController.restyle);
aiGenerationRouter.get("/restyle/jobs", aiGenerationController.getJobs);
aiGenerationRouter.get("/restyle/:jobId", aiGenerationController.getJobById);

export default aiGenerationRouter;
