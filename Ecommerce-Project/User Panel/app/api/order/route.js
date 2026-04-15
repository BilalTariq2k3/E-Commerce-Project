import connectDB from "../../../lib/mongodb";
import Order from "../../../model/order";
import Notification from "../../../model/notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const POST = async (req) => {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;

    const body = await req.json();
    const { items, email, phone, address, totalbill,paymentmethod } = body;
    const newOrder = await Order.create({
      userId,
      items,
      email,
      address,
      phone,
      totalbill,
      paymentmethod,
    });

    await Notification.create({
      userId,
      orderId: newOrder._id,
      message: "Order placed",
    });

    return new Response(JSON.stringify(newOrder), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    console.error("ERROR MESSAGE:", err.message);

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

    const data = await Order.find({ userId }, "_id totalbill createdAt").sort({
      createdAt: -1,
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


