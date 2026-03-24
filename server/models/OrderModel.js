import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    shippingCost: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
    },
    shippingAddress: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      postal_code: { type: String, default: "" },
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "online_payment"],
      default: "cash_on_delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    stripePaymentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
