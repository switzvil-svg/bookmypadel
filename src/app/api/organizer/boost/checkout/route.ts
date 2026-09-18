import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { startBoostCheckout } from "@/lib/boosts";
import { getStripeClient } from "@/lib/stripe";
import { BOOST_CONFIG } from "@/lib/config";
import { getStageByIdDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "organizer") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    console.error("[api/organizer/boost/checkout] STRIPE_SECRET_KEY not configured");
    return NextResponse.json(
      { error: "Le paiement des mises en avant n'est pas encore configuré. Contactez-nous." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => null)) as any;
  const stageId = typeof body?.stageId === "string" ? body.stageId : "";
  if (!stageId) {
    return NextResponse.json({ error: "Stage manquant." }, { status: 400 });
  }

  let result;
  try {
    result = await startBoostCheckout(stageId, user.id);
  } catch (err) {
    console.error("[api/organizer/boost/checkout] startBoostCheckout failed:", err);
    return NextResponse.json({ error: "Erreur serveur, réessayez dans un instant." }, { status: 500 });
  }
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const stage = await getStageByIdDb(stageId);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(BOOST_CONFIG.PRICE_EUR * 100),
            product_data: {
              name: `Mise en avant BookMyPadel — ${stage?.title ?? "stage"}`,
              description: `${BOOST_CONFIG.DURATION_DAYS} jours en page d'accueil, section « À la une »`,
            },
          },
        },
      ],
      metadata: { boostId: result.boostId, stageId, organizerId: user.id },
      success_url: `${siteUrl}/organisateurs/stages/${stageId}/booster/succes?boost=${result.boostId}`,
      cancel_url: `${siteUrl}/organisateurs/stages/${stageId}/booster/annule`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[api/organizer/boost/checkout] Stripe session creation failed:", err);
    return NextResponse.json({ error: "Erreur serveur, réessayez dans un instant." }, { status: 500 });
  }
}
