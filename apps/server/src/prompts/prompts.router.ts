import { Router, type Router as ExpressRouter } from "express";
import { promptCacheService } from "./prompts.service.js";

const promptsRouter: ExpressRouter = Router();

promptsRouter.post("/prompts/refresh", async (req, res) => {
  await promptCacheService.reload();
  res.status(204).end();
});

export default promptsRouter;
