import { v4 as uuidv4 } from "uuid";
import { redisClient } from "../lib/redis.js";
import type { Job, UpdateJob } from "./job.dto.js";

const JOB_TTL_SECONDS = 60 * 60 * 24; // 24h

function jobKey(id: string) {
  return `job:${id}`;
}

class JobService {
  async createJob(input: unknown): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const job: Job = {
      id,
      status: "pending",
      input,
      createdAt: now,
      updatedAt: now,
    };

    await redisClient.set(jobKey(id), JSON.stringify(job), {
      EX: JOB_TTL_SECONDS,
    });

    return id;
  }

  async getJob(id: string): Promise<Job | null> {
    const data = await redisClient.get(jobKey(id));
    if (!data) return null;
    return JSON.parse(data);
  }

  async updateJob(id: string, newValues: UpdateJob): Promise<void> {
    const key = jobKey(id);
    const data = await redisClient.get(key);
    if (!data) throw new Error("Job not found");

    const job: Job = JSON.parse(data);

    const updated: Job = {
      ...job,
      ...newValues,
      updatedAt: new Date().toISOString(),
    };

    // TTL не змінюємо → зберігаємо існуючий
    const ttl = await redisClient.ttl(key);

    await redisClient.set(key, JSON.stringify(updated), {
      EX: ttl > 0 ? ttl : JOB_TTL_SECONDS,
    });
  }

  async completeJob<T>(id: string, result: T): Promise<void> {
    const key = jobKey(id);
    const data = await redisClient.get(key);
    if (!data) throw new Error("Job not found");

    const job: Job = JSON.parse(data);

    const updated: Job = {
      ...job,
      status: "completed",
      result,
      updatedAt: new Date().toISOString(),
    };

    const ttl = await redisClient.ttl(key);

    await redisClient.set(key, JSON.stringify(updated), {
      EX: ttl > 0 ? ttl : JOB_TTL_SECONDS,
    });
  }

  async failJob(id: string, error: string): Promise<void> {
    const key = jobKey(id);
    const data = await redisClient.get(key);
    if (!data) throw new Error("Job not found");

    const job: Job = JSON.parse(data);

    const updated: Job = {
      ...job,
      status: "failed",
      error,
      updatedAt: new Date().toISOString(),
    };

    const ttl = await redisClient.ttl(key);

    await redisClient.set(key, JSON.stringify(updated), {
      EX: ttl > 0 ? ttl : JOB_TTL_SECONDS,
    });
  }
}

export const jobService = new JobService();
