import express, { Router, type Router as ExpressRouter } from "express";
import { billingController } from "../billing/billing.controller.js";

const webhooksRouter: ExpressRouter = Router();

webhooksRouter.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  billingController.webhook,
);

export default webhooksRouter;
