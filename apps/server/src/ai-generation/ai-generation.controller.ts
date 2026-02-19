import type { Request, Response } from "express";
import { aiGenerationService } from "./ai-generation.service.js";
import { jobService } from "../job-pooling/job.service.js";
import type { UserDTO } from "../user/user.dto.js";
import { BadRequestError } from "../errors/apiErrors.js";

class AIGenerationController {
  restyle = async (req: any, res: Response) => {
    const user = req.user as UserDTO;

    const result = await aiGenerationService.restyle(user.id, req.body);
    res.json(result);
  };

  getJobById = async (req: Request, res: Response) => {
    const jobId = req.params.jobId as string;
    if (!jobId) throw new BadRequestError("Job Id is required");

    const job = await jobService.getJob(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  };

  getJobs = async (req: Request, res: Response) => {
    const jobIds = req.body as string[];
    const ids = req.query.ids as string;
    if (!jobIds && !ids) throw new BadRequestError("Jobs Ids is required");

    const normalizedIds = ids ? ids.split(",") : jobIds;

    const results = await Promise.all(
      normalizedIds.map((job) => jobService.getJob(job)),
    );

    res.json(results);
  };
}

export const aiGenerationController = new AIGenerationController();
