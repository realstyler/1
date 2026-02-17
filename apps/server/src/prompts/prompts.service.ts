import type { StylePreset } from "@prisma/client";
import { prisma } from "../lib/prisma/index.js";

class PromptCacheService {
  private cache = new Map<StylePreset, string>();
  private loaded = false;

  async load() {
    const prompts = await prisma.stylePrompt.findMany();

    this.cache.clear();

    for (const p of prompts) {
      this.cache.set(p.preset, p.content);
    }

    this.loaded = true;
    console.log(`[PromptCache] Loaded ${this.cache.size} style prompts`);
  }

  get(preset: StylePreset): string {
    if (!this.loaded) {
      throw new Error("Prompt cache not loaded");
    }

    const prompt = this.cache.get(preset);
    if (!prompt) {
      throw new Error(`Prompt not found for preset: ${preset}`);
    }

    return prompt;
  }

  async reload() {
    console.log("[PromptCache] Reloading...");
    await this.load();
  }
}

export const promptCacheService = new PromptCacheService();
