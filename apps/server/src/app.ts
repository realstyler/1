import express from "express";
import "dotenv/config";
import urlScraperRouter from "./urlScraper/urlScraper.router.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello from server");
});

app.use("/api", urlScraperRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
