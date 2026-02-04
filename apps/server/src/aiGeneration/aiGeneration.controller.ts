import type { Request, Response } from "express";
import { aiGenerationService } from "./aiGeneration.service.js";
import { parseOrThrow } from "../validation/parseOrThrow.js";
import { RestyleSchema } from "../schemas/ai.schemas.js";
import { jobService } from "../job-pooling/job.service.js";
import ApiError from "../errors/apiError.js";

class AIGenerationController {
  restyle = async (req: Request, res: Response) => {
    const { model, images } = parseOrThrow(RestyleSchema, req.body);
    const result = await aiGenerationService.restyle(images, model);
    res.json(result);
  };

  getJobById = async (req: Request, res: Response) => {
    const jobId = req.params.jobId as string;
    if (!jobId) throw new ApiError("Job Id is required", 400);

    const job = await jobService.getJob(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  };
}

export const aiGenerationController = new AIGenerationController();
