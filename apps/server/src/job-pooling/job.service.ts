import { v4 as uuidv4 } from "uuid";
import type { Job, JobStatus, UpdateJob } from "../types/index.js";

class JobService {
  private jobs = new Map<string, Job>();

  async createJob(input: any): Promise<string> {
    const id = uuidv4();
    const now = new Date();

    this.jobs.set(id, {
      id,
      status: "pending",
      input,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  }

  async getJob(id: string): Promise<Job | null> {
    return this.jobs.get(id) ?? null;
  }

  async updateJob(id: string, newValues: UpdateJob) {
    const job = this.jobs.get(id);
    if (!job) throw new Error("Job not found");

    const newData = {
      ...job,
      ...newValues,
    };

    newData.updatedAt = new Date();
    this.jobs.set(id, newData);
  }

  async completeJob<T>(id: string, result: T) {
    const job = this.jobs.get(id);
    if (!job) throw new Error("Job not found");

    job.status = "completed";
    job.result = result;
    job.updatedAt = new Date();
    this.jobs.set(id, job);
  }
}

export const jobService = new JobService();
