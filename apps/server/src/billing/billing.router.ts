import { Router, type Router as ExpressRouter } from "express";
import { billingController } from "./billing.controller.js";
import { sessionUser } from "../middlewares/sessionUser.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const billingRouter: ExpressRouter = Router();

billingRouter.post(
  "/checkout",
  requireAuth,
  sessionUser,
  billingController.createCheckoutSession,
);

export default billingRouter;
