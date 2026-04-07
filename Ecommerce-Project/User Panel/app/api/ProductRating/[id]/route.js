import connectDB from "../../../../lib/mongodb";
import Order from "../../../../model/order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export const PUT = async (req, context) => {
  const { productId, rating, review } = await req.json();

  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { params } = context;
    const resolvedParams = await params;
    const { id } = resolvedParams;


    const userId = session.user.id;

    const productObjectId = new mongoose.Types.ObjectId(productId);

    const order = await Order.findOneAndUpdate(
      {
        _id: id,
        userId: userId,
        "items.productId": productObjectId,
      },
      {
        $set: {
          "items.$.rating": rating,
          "items.$.review": review,
        },
      },
      { new: true },
    );

    if (!order) {
      return new Response(
        JSON.stringify({ error: "Order or product not found" }),
        { status: 404 },
      );
    }

    return new Response(JSON.stringify({ order }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const GET = async (req, context) => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { params } = context;
    const resolvedParams = await params; // unwrap Promise
    const { id } = resolvedParams; // order ID
    const productId = req.nextUrl.searchParams.get("productId"); // get productId from query

    if (!productId) {
      return new Response(JSON.stringify({ error: "productId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);
    const userId = session.user.id;

    // Find the order and specific product
    const order = await Order.findOne(
      {
        _id: id,
        userId,
        "items.productId": productObjectId,
      },
      { "items.$": 1 }, // only return the matched item
    );

    if (!order || order.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Order or product not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const { rating, review } = order.items[0];

    return new Response(JSON.stringify({ rating, review }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
