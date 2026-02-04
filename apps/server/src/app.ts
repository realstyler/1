import express from "express";
import urlScraperRouter from "./urlScraper/urlScraper.router.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import billingRouter from "./billing/billing.router.js";
import webhooksRouter from "./webhooks/webhooks.router.js";
import { environment } from "./config/environment.js";
import imageUploadRouter from "./upload/imageUpload.router.js";
import aiGenerationRouter from "./aiGeneration/aiGeneration.router.js";

const PORT = environment.PORT;
const app = express();

app.use("/webhooks", webhooksRouter);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello from server");
});

app.use("/api", imageUploadRouter)
app.use("/api", urlScraperRouter);
app.use("/api", aiGenerationRouter)
app.use("/api", billingRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
