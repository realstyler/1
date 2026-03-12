import type { StylePreset, Style } from "@prisma/client";
import { prisma } from "../lib/prisma/index.js";
import { imagesService } from "../images/images.service.js";

export type PublicStyleInfo = Omit<Style, "content" | "updatedAt">;

class StylesService {
  private cache = new Map<StylePreset, Style>();
  private loaded = false;

  async loadPrompts() {
    const styles = await prisma.style.findMany();

    this.cache.clear();

    for (const s of styles) {
      this.cache.set(s.preset, s);
    }

    this.loaded = true;
    console.log(`[StyleCache] Loaded ${this.cache.size} styles`);
  }

  getPrompt(preset: StylePreset): string {
    if (!this.loaded) {
      throw new Error("Style cache not loaded");
    }

    const style = this.cache.get(preset);
    if (!style) {
      throw new Error(`Style not found for preset: ${preset}`);
    }

    return style.content;
  }

  getPublicStyles(): PublicStyleInfo[] {
    if (!this.loaded) {
      throw new Error("Style cache not loaded");
    }

    const stylesArray = Array.from(this.cache.values());
    
    return stylesArray.map((style) => {
      let finalImageUrl = style.imageUrl;

      if (finalImageUrl && !finalImageUrl.startsWith("http")) {
        finalImageUrl = imagesService.getPublicUrl(finalImageUrl);
      }

      return {
        preset: style.preset,
        displayName: style.displayName,
        description: style.description,
        colorPalette: style.colorPalette,
        imageUrl: finalImageUrl,
      };
    });
  }

  async reload() {
    console.log("[StyleCache] Reloading...");
    await this.loadPrompts();
  }
}

export const stylesService = new StylesService();