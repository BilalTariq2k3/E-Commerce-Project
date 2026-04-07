import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalprice: { type: Number, required: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
