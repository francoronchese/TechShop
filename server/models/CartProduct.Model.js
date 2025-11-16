import mongoose from 'mongoose';

const cartProductSchema = mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'product',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  }
);

const CartProductModel = mongoose.model('cartProduct', cartProductSchema);

export default CartProductModel;
