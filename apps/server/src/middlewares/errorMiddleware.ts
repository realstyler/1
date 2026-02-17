import type { Request, Response, NextFunction } from "express";
import { ApiError } from "shared";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (err instanceof ApiError) {
    return res
      .status(err.status || 500)
      .json({ message: err.message, code: err.code });
  }

  res.status(500).json({ message: err.message || "Internal server error" });
}
