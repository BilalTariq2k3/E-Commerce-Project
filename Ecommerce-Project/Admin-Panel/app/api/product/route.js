import connectdb from "../../../lib/mongodb";
import Product from "../../../models/product";
import Category from "../../../models/category";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    console.log("data");
    await connectdb();

    // Populate category name
    const products = await Product.find()
      .populate("category_id", "name")
      .sort({ createdAt: -1 });
    const categories = await Category.find({}, { _id: 1, name: 1 });
    return Response.json({
      success: true,
      data: products,
      categories: categories,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectdb();

    const formData = await req.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const quantity = formData.get("quantity");
    const category_id = formData.get("category_id");
    const image = formData.get("image");

    if (!image) {
      return Response.json({ message: "Image required" }, { status: 400 });
    }

    // 🔹 Convert image to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🔹 Define upload path
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // ✅ IMPORTANT FIX → create folder if not exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = Date.now() + "-" + image.name;
    const filePath = path.join(uploadDir, fileName);

    // 🔹 Save file
    await writeFile(filePath, buffer);

    const newProduct = await Product.create({
      name,
      description,
      price,
      quantity,
      category_id,
      image: `/uploads/${fileName}`,
    });

    return Response.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
