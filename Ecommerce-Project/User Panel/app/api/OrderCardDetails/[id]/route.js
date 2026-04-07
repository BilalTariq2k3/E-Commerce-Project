import connectDB from "../../../../lib/mongodb";
import Order from "../../../../model/order";
import Product from "../../../../model/product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // your NextAuth config

export const GET = async (req, { params }) => {
  const { id } = await params;



  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;


    const data = await Order.findOne({
      _id: id,
      userId: userId,
    })
      .select(
        "email address phone totalbill items.quantity items.rating items.review  items.productId ",
      )
      .populate({
        path: "items.productId", // reference field
        select: "name price image quantity totalbill", // fields from Product
      });

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
