import connectDB from "../../../lib/mongodb";
import Category from "../../../model/category";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");

    const categories = await Category.find().limit(limit ? Number(limit) : 0);

    return new Response(
      JSON.stringify({ message: "Categories fetched", data: categories }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
