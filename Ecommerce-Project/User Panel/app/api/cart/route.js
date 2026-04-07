import connectDB from "../../../lib/mongodb";
import mongoose from "mongoose";
import Cart from "../../../model/cart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const POST = async (req) => {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    const { name, productId, image, quantity, price, totalprice } =
      await req.json();

    const cartItem = await Cart.create({
      name,
      productId,
      image,
      quantity,
      price,
      totalprice,
      userId: session.user.id,
    });

    return new Response(JSON.stringify(cartItem), {
      status: 201,
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

export const GET = async () => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;

    const cartData = await Cart.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user" } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product" } },
      {
        $project: {
          quantity: 1,
          price: 1,
          totalprice: 1,
          "user.email": 1,
          "user.address": 1,
          "user.phone": 1,
          "product.name": 1,
          "product._id": 1,
          "product.image": 1,
          productQuantity: "$product.quantity",
        },
      },
    ]);
    return new Response(
      JSON.stringify({ message: "user cart fetched", data: cartData }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE = async () => {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;

    const result = await Cart.deleteMany({ userId });

    return new Response(
      JSON.stringify({
        message: "user cart cleared",
        deletedCount: result.deletedCount,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
