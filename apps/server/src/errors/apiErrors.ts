export default class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

// 400 Bad Request
export class BadRequestError extends ApiError {
  constructor(message?: string) {
    super(message ?? "Bad request", 400);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends ApiError {
  constructor(message?: string) {
    super(message ?? "Unauthorized", 401);
  }
}

// 403 Forbidden
export class ForbiddenError extends ApiError {
  constructor(message?: string) {
    super(message ?? "Forbidden", 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message?: string) {
    super(message ?? "Resource not found", 404);
  }
}

// 409 Conflict
export class ConflictError extends ApiError {
  constructor(message?: string) {
    super(message ?? "Conflict", 409);
  }
}

// 422 Unprocessable Entity
export class ValidationError extends ApiError {
  constructor(message?: string) {
    super(message ?? "Validation failed", 422);
  }
}

// 500 Internal Server Error
export class InternalServerError extends ApiError {
  constructor(message?: string) {
    super(message ?? "Internal server error", 500);
  }
}
