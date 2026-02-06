import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import session from "express-session";
import { environment } from "../config/environment.js";

let redisStore; // Store for express-session
let redisClient;

export default async function initRedisStore() {
  try {
    redisClient = createClient({
      url: `redis://${environment.REDIS_HOST}:${environment.REDIS_PORT}`,
    });

    redisClient.on("connect", () => console.log("Redis client connected"));

    await redisClient.connect();

    redisStore = new RedisStore({
      client: redisClient,
      ttl: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("Using Redis session store");
  } catch (err) {
    console.error("Redis unavailable, falling back to MemoryStore");
    console.error("Redis error:", err);

    // fallback on memory store
    redisStore = new session.MemoryStore();
    console.log("Using MemoryStore session store");
  }

  return redisStore;
}
