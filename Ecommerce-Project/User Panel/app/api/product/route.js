import connectDB from "../../../lib/mongodb";
import Product from "../../../model/product";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const limit = searchParams.get("limit"); // number
    const name = searchParams.get("name"); // search by product name
    const minPrice = searchParams.get("minPrice"); // minimum price
    const maxPrice = searchParams.get("maxPrice"); // maximum price

    // Build the filter object dynamically
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // case-insensitive search
    }

    if (minPrice) {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }

    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }

    // Fetch products with filter and limit
    const products = await Product.find(filter)
      .limit(limit ? Number(limit) : 0)
      .sort({ createdAt: -1 }); // optional: latest products first

    return new Response(
      JSON.stringify({ message: "Products fetched", data: products }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const { products } = await req.json();

    if (!products || !Array.isArray(products)) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
      });
    }

    for (const p of products) {
      // Ensure quantity is not negative
      const newQuantity = Math.max(p.proquantity, 0);

      await Product.findByIdAndUpdate(
        p.proid,
        { quantity: newQuantity },
        { new: true },
      );
    }

    return new Response(
      JSON.stringify({ message: "Products updated successfully" }),
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
