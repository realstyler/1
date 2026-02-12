import type { Request, Response } from "express";
import { urlScraperService } from "./url-scraper.service.js";

class URLScraperController {
  scrapeUrl = async (req: Request, res: Response) => {
    const { url } = req.body;
    const result = await urlScraperService.scrapeUrl(url);
    res.json({ imgUrl: result });
  };
}

export const urlScraperController = new URLScraperController();
