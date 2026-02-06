import type { Request, Response } from "express";
import { billingService } from "./billing.service.js";

class BillingController {
  createCheckoutSession = async (req: Request, res: Response) => {
    // const customerId = req.user.stripeCustomerId
    // const session = await billingService.createCheckoutSession();
    // res.json({ url: session.url });
    res.end()
  };

  webhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"]!;
    await billingService.webhookHandler(req.body, sig);
    res.end();
  };
}

export const billingController = new BillingController();
