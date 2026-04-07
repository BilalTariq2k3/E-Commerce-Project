import connectDB from "../../../../lib/mongodb";
import Order from "../../../../model/order";

export const GET = async (req, context) => {
  try {
    await connectDB();

    const { params } = context;
    const resolvedParams = await params; // unwrap Promise
    const { id } = resolvedParams; // order ID
    if (! id ) {
      return new Response(JSON.stringify({ error: "Product ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find all orders that contain this product
    const orders = await Order.find({
      "items.productId":  id ,
    }).select("items createdAt updatedAt");

    // Collect all rating & review for this product
   const ratingsAndReviews = [];

orders.forEach(order => {
  order.items.forEach(item => {
    if (item.productId.toString() === id) {
      ratingsAndReviews.push({
        rating: item.rating || 0,
        review: item.review || "",
        createdAt: order.createdAt, 
        updatedAt: order.updatedAt, 
      });
    }
  });
});

    return new Response(
      JSON.stringify({ ratingsAndReviews }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("error", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};