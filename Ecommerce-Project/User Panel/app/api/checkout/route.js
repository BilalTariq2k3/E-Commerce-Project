import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, email } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const line_items = items.map((item) => {
      const price = Number(item.totalprice || item.price);
      if (isNaN(price)) throw new Error("Invalid price for item: " + item.productName);
      return {
        price_data: {
          currency: "usd",
          product_data: { name: item.productName || "Product" },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: email, // optional but useful for success page
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:3000/cart",
    });

    console.log("Stripe session created:", session.id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}