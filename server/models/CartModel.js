import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'product',
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model('cartProduct', cartSchema);
export default CartModel;