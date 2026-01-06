import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
    },
    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SubCategoryModel = mongoose.model('subCategory', subCategorySchema);

export default SubCategoryModel;
