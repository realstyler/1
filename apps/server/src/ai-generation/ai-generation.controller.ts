import type { Request, Response } from "express";
import { aiGenerationService } from "./ai-generation.service.js";
import { jobService } from "../job-pooling/job.service.js";
import ApiError from "../errors/apiError.js";
import type { UserDTO } from "../user/user.dto.js";

class AIGenerationController {
  restyle = async (req: any, res: Response) => {
    const user = req.user as UserDTO;

    const result = await aiGenerationService.restyle(user.id, req.body);
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
