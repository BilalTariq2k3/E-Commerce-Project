import connectDB from "../../../lib/mongodb";
import Product from "../../../model/product";
import Category from "../../../model/category";

export const GET = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");

    const ProductData = await Product.find()
      .limit(limit ? Number(limit) : 0)
      .select("name price image");

    const CategoryData = await Category.find()
      .limit(limit ? Number(limit) : 0)
      .select("name  image");


    return new Response(
      JSON.stringify({
        message: "user cart fetched",
        data: {
          ProductData: ProductData,
          CategoryData: CategoryData,
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
