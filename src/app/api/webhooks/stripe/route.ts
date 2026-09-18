import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { confirmBoostFromWebhook } from "@/lib/boosts";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    console.error("[api/webhooks/stripe] Stripe not configured");
    return NextResponse.json({ error: "Non configuré." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let event;
  try {
    // constructEventAsync (not the sync constructEvent) because signature
    // verification needs Web Crypto's SubtleCrypto on the Workers runtime —
    // Node's sync crypto isn't available here.
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch (err) {
    console.error("[api/webhooks/stripe] signature verification failed:", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { boostId?: string }; payment_intent?: string | null };
    const boostId = session.metadata?.boostId;
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : "";
    if (boostId && paymentIntentId) {
      await confirmBoostFromWebhook(boostId, paymentIntentId);
    } else {
      console.error("[api/webhooks/stripe] checkout.session.completed missing boostId/payment_intent", {
        boostId,
        paymentIntentId,
      });
    }
  }

  return NextResponse.json({ received: true });
}
