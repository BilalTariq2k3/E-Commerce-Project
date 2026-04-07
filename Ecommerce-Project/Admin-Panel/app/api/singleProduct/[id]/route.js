import connectdb from "../../../../lib/mongodb";
import Product from "../../../../models/product";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

export async function GET(params, context) {
  try {
    await connectdb();
    const { id } = await context.params;

    const singleproduct = await Product.findById(id);
    return Response.json({
      success: true,
      data: singleproduct,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(params, context) {
  try {
    await connectdb();
    const { id } = await context.params;

    const singleproduct = await Product.findByIdAndDelete(id);
    return Response.json({
      success: true,
      data: singleproduct,
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
    const price = formData.get("price");
    const quantity = formData.get("quantity");
    const category_id = formData.get("category_id");
    const image = formData.get("image");

    let updatedData = {
      name,
      description,
      price,
      quantity,
      category_id,
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

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProduct) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    return Response.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
