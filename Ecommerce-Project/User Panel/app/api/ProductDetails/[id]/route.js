import connectDB from "../../../../lib/mongodb";
import Product from "../../../../model/product";

export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;
  try {
    await connectDB();

    const productdata = await Product.findById(id).lean();
    if (!productdata) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(productdata), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
