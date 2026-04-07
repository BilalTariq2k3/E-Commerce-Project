import connectdb from '../../../../lib/mongodb';
import Order from "../../../../models/order";

export async function GET(params, context) {
  try {
    await connectdb();
    const { id } = await context.params;

    const singleproduct = await Order.findById(id)
     .select("email address phone totalbill paymentmethod items.quantity items.productId createdAt")
     .populate({
        path: "items.productId", // reference field
        select: "name price image  ", // fields from Product
      })
      .populate({
        path: "userId",
        select: "fname lname",
      })
    .sort({ createdAt: -1 });
    return Response.json({
      success: true,
      data: singleproduct,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}