import type { Request, Response } from "express";
import { billingService } from "./billing.service.js";

class BillingController {
  createCheckoutSession = async (_: Request, res: Response) => {
    const session = await billingService.createCheckoutSession();
    res.json({ url: session.url });
  };

  webhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"]!;
    await billingService.webhookHandler(req.body, sig);
    res.end();
  };
}

export const billingController = new BillingController();
