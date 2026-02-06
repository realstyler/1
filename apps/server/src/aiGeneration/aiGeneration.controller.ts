import type { Request, Response } from "express";
import { aiGenerationService } from "./aiGeneration.service.js";
import { zodParseOrThrow } from "../utils/zodParseOrThrow.util.js";
import { RestyleSchema } from "./ai.schemas.js";
import { jobService } from "../job-pooling/job.service.js";
import ApiError from "../errors/apiError.js";

class AIGenerationController {
  restyle = async (req: Request, res: Response) => {
    const { model, images } = zodParseOrThrow(RestyleSchema, req.body);
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

  getJobs = async (req: Request, res: Response) => {
    const jobIds = req.body as string[];
    if (!jobIds) throw new ApiError("Jobs Ids is required", 400);

    const results = await Promise.all(
      jobIds.map((job) => jobService.getJob(job)),
    );

    res.json(results);
  };
}

export const aiGenerationController = new AIGenerationController();
