import { createSlice } from '@reduxjs/toolkit';

const initialValue = {
  _id: '',
  name: '',
  email: '',
  avatar: '',
  mobile: null,
  role: 'User',
  status: 'Active',
  addresses: [],
  shopping_cart_items: [],
  orders: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialValue,
  reducers: {
    setUserDetails: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.mobile = action.payload.mobile;
      state.role = action.payload.role;
      state.status = action.payload.status;
      state.addresses = action.payload.addresses;
      state.shopping_cart_items = action.payload.shopping_cart_items;
      state.orders = action.payload.orders;
    },
    endUserSession: (state) => {
      // Reset all user state properties to initial values
      Object.assign(state, initialValue);
    },
  },
});

export const { setUserDetails, endUserSession } = userSlice.actions;
export default userSlice.reducer;
