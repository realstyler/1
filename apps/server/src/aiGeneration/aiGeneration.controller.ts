import type { Request, Response } from "express";
import { aiGenerationService } from "./aiGeneration.service.js";
import { parseOrThrow } from "../validation/parseOrThrow.js";
import { RestyleSchema } from "../schemas/ai.schemas.js";

class AIGenerationController {
  restyle = async (req: Request, res: Response) => {
    const { model, images } = parseOrThrow(RestyleSchema, req.body);
    const result = await aiGenerationService.restyle(images, model);
    res.json(result);
  };

  getJobById = async (req: Request, res: Response) => {};
}

export const aiGenerationController = new AIGenerationController();
