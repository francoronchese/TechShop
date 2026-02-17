import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: Array,
      default: [],
    },
    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
      },
    ],
    sub_categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'subCategory',
      },
    ],
    stock: {
      type: Number,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    discount: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model('product', productSchema);

export default ProductModel;
