import { environment } from "../config/environment.js";
import { stripe } from "../lib/stripe.js";

class BillingService {
  async createCheckoutSession() {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: environment.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],

      success_url: environment.CLIENT_URL,
      cancel_url: environment.CLIENT_URL,
    });

    return session;
  }

  async webhookHandler(payload: string, header: string | string[]) {
    const event = stripe.webhooks.constructEvent(
      payload,
      header,
      environment.STRIPE_WEBHOOK_SECRET!,
    );

    console.log("event", event)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // activate access here
      // session.customer
      // session.subscription
    }
  }
}

export const billingService = new BillingService();
