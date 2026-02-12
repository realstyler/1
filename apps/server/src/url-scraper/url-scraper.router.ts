import { Router, type Router as ExpressRouter } from "express";
import { urlScraperController } from "./url-scraper.controller.js";

const urlScraperRouter: ExpressRouter = Router();

urlScraperRouter.post("/scrape-url", urlScraperController.scrapeUrl)

export default urlScraperRouter