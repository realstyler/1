import type { Request, Response } from "express";
import { aiGenerationService } from "./ai-generation.service.js";
import { jobService } from "../job-pooling/job.service.js";
import type { UserDTO } from "../user/user.dto.js";
import { BadRequestError } from "../errors/apiErrors.js";
import { imageUploadService } from "../upload/image-upload.service.js";
import type { RequestIdentity } from "../types/index.js";

class AIGenerationController {
  restyle = async (req: Request, res: Response) => {
    const user = (req as any).user as UserDTO | undefined;
    const forwardedFor = req.headers["x-forwarded-for"];
    
    const ipString = Array.isArray(forwardedFor) 
      ? forwardedFor[0] 
      : forwardedFor?.split(",")[0];

    const ip: string = ipString || req.socket.remoteAddress || "unknown_ip";

    const identity: RequestIdentity = user
      ? { type: "user", id: user.id }
      : { type: "guest", id: ip };

    const result = await aiGenerationService.restyle(identity, req.body);
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
    const createSignedUrls = req.query.signed_urls === "true";
    if (!jobIds && !ids) throw new BadRequestError("Jobs Ids is required");

    const normalizedIds = ids ? ids.split(",") : jobIds;

    const results = await Promise.all(
      normalizedIds.map((job) => jobService.getJob(job)),
    );

    if (createSignedUrls) {
      const originalPaths = results.map((j) =>
        j && j.input && j.status === "completed"
          ? (j.input.path as string)
          : null,
      );
      const restyledPaths = results.map((j) =>
        j && j.result && j.status === "completed"
          ? (j.result.path as string)
          : null,
      );
      const originalUrls = await imageUploadService.createSignedUrls(
        originalPaths as string[],
      );
      const restyledUrls = await imageUploadService.createSignedUrls(
        restyledPaths as string[],
      );

      results.forEach((j, i) => {
        if (j) {
          j.input.url = originalUrls[i];
          if (j.result) j.result.url = restyledUrls[i];
        }
      });
    }

    res.json(results);
  };
}

export const aiGenerationController = new AIGenerationController();
