import connectdb from '../../../lib/mongodb';
import Order from "../../../models/order";


export async function GET() {
  try {
    await connectdb();

    const orderdata = await Order.find()
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
      data: orderdata,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
