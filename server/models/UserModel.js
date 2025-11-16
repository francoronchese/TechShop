import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Provide name'],
    },
    email: {
      type: String,
      required: [true, 'Provide email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Provide password'],
    },
    avatar: {
      type: String,
      default: '',
    },
    mobile: {
      type: Number,
      default: null,
    },
    refresh_token: {
      type: String,
      default: '',
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
    },
    address_id: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'address',
      },
    ],
    shopping_cart_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'cartProduct',
      },
    ],
    order_history_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'order',
      },
    ],
    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_expiry: {
      type: Date,
      default: '',
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('user', userSchema);

export default UserModel;
