import connectDB from "../../../lib/mongodb";
import Category from "../../../models/category";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    console.log("API HIT");

    const categorydata = await Category.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: categorydata,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const formdata = await req.formData();

    const name = formdata.get("name");
    const description = formdata.get("description");
    const image = formdata.get("image");

    if (!image) {
      return NextResponse.json({ message: "Image required" }, { status: 400 });
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

    const newProduct = await Category.create({
      name,
      description,
      image: `/uploads/${fileName}`,
    });

    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
