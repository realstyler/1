import type { Request, Response } from "express";
import { urlScraperService } from "./url-scraper.service.js";
import { BadRequestError } from "../errors/apiErrors.js";

class URLScraperController {
  scrapeUrl = async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) throw new BadRequestError("Url is required");
    const result = await urlScraperService.scrapeUrl(url);
    res.json({ images: result });
  };
}

export const urlScraperController = new URLScraperController();
