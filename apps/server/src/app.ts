import express from "express";
import "dotenv/config";
import urlScraperRouter from "./urlScraper/urlScraper.router.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import billingRouter from "./billing/billing.router.js";
import webhooksRouter from "./webhooks/webhooks.router.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use("/webhooks", webhooksRouter);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello from server");
});

app.use("/api", urlScraperRouter);
app.use("/api", billingRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
