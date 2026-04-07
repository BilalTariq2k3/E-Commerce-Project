import connectDB from "../../../lib/mongodb";
import Order from "../../../model/order";
import Cart from "../../../model/cart";
import Product from "../../../model/product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

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
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const OrderData = await Order.aggregate([
      { $match: { userId: objectUserId } },
      { $unwind: "$items" },
      { $group: { _id: "$items.productId" } },
      { $count: "uniqueProductCount" },
    ]);

    // ✅ extract number
    const totalOrders = OrderData[0]?.uniqueProductCount || 0;

    const cartData = await Cart.countDocuments({ userId });
    const ProductData = await Product.countDocuments();

    return new Response(
      JSON.stringify({
        message: "user cart fetched",
        data: {
          totalOrders: totalOrders,
          totalCartItems: cartData,
          totalProductItems: ProductData,
        },
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
