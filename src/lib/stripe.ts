import Stripe from "stripe";

// The default stripe-node HTTP client uses Node's `http`/`https` modules,
// which don't exist on the Cloudflare Workers runtime even with
// nodejs_compat. Stripe's official fix for edge runtimes is its Fetch-based
// client — see https://github.com/stripe/stripe-node#usage-with-typescript-edge-runtimes.
export function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}
