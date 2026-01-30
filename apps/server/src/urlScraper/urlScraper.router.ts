import { Router, type Router as ExpressRouter } from "express";
import { urlScraperController } from "./urlScraper.controller.js";

const urlScraperRouter: ExpressRouter = Router();

urlScraperRouter.post("/scrape-url", urlScraperController.scrapeUrl)

export default urlScraperRouter