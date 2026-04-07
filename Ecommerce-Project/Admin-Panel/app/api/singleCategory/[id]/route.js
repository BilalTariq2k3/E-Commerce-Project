import connectdb from "../../../../lib/mongodb";
import Category from "../../../../models/category";
import Product from "../../../../models/product";
import { writeFile } from "fs/promises";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export async function GET(params, context) {
  try {
    await connectdb();
    const { id } = await context.params;

    const singlecategory = await Category.findById(id);
    return Response.json({
      success: true,
      data: singlecategory,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectdb();

    const { id } = await context.params;

      const categoryId = new mongoose.Types.ObjectId(id);

    // ✅ Delete related products
    const deletedProducts = await Product.deleteMany({
      category_id: categoryId,
    });

    console.log("Deleted products:", deletedProducts);

    // ✅ Delete category
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    return Response.json({
      success: true,
      data: deletedCategory,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectdb();

    const { id } = await context.params;

    const formData = await req.formData();

    const name = formData.get("name");
    const description = formData.get("description");

    const image = formData.get("image");

    let updatedData = {
      name,
      description,
    };

    // 🔹 If new image uploaded → replace old one
    if (image && image.name) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = Date.now() + "-" + image.name;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      updatedData.image = `/uploads/${fileName}`;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedCategory) {
      return Response.json({ message: "Category not found" }, { status: 404 });
    }

    return Response.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
