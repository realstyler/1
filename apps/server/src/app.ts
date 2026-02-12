import express from "express";
import session from "express-session";
import urlScraperRouter from "./url-scraper/url-scraper.router.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import billingRouter from "./billing/billing.router.js";
import webhooksRouter from "./webhooks/webhooks.router.js";
import { environment } from "./config/environment.js";
import imageUploadRouter from "./upload/image-upload.router.js";
import aiGenerationRouter from "./ai-generation/ai-generation.router.js";
import authRouter from "./auth/auth.router.js";
import initRedisStore from "./lib/redis.js";
import { promptCacheService } from "./prompts/prompts.service.js";
import promptsRouter from "./prompts/prompts.router.js";

(async () => {
  const PORT = environment.PORT;
  const app = express();
  const store = await initRedisStore(); // connect Redis or fallback
  await promptCacheService.load(); // load and save prompts

  app.use("/webhooks", webhooksRouter);

  app.use(express.json());

  app.use(
    session({
      store,
      secret: environment.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: environment.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    }),
  );

  app.get("/", (_req, res) => {
    res.send("Hello from server");
  });

  app.use("/api", authRouter);
  app.use("/api", imageUploadRouter);
  app.use("/api", urlScraperRouter);
  app.use("/api", aiGenerationRouter);
  app.use("/api", billingRouter);
  app.use("/api", promptsRouter);

  app.use(errorMiddleware);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
