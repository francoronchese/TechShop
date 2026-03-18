import mongoose from 'mongoose';

const cartProductSchema = new mongoose.Schema(
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

const CartProductModel = mongoose.model('cartProduct', cartProductSchema);
export default CartProductModel;