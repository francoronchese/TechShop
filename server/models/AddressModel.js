import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    postal_code: {
      type: String,
      default: '',
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model('address', addressSchema);

export default AddressModel;
