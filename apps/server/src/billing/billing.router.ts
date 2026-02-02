import { Router, type Router as ExpressRouter } from "express";
import { billingController } from "./billing.controller.js";

const billingRouter: ExpressRouter = Router();

billingRouter.post("/checkout", billingController.createCheckoutSession);

export default billingRouter;
