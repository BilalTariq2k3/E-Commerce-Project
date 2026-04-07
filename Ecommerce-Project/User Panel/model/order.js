import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        totalPrice: Number,
        review: {
          type: String,
          trim: true,
          default: "",
        },
        rating: {
          type: Number,
          default: 0,
        },
      },
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    totalbill: { type: Number, required: true },
    paymentmethod: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
