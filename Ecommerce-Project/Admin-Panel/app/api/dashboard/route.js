import connectdb from "../../../lib/mongodb";
import User from "../../../models/user";
import Order from "../../../models/order";
import Category from "../../../models/category";
import Product from "../../../models/product";

export async function GET() {
  try {
    await connectdb();

    const [totalUsers, totalOrders, totalCategories, totalProducts] =
      await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Category.countDocuments(),
        Product.countDocuments(),
      ]);

    return Response.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalCategories,
        totalProducts,
      },
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
