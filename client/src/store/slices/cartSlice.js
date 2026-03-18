import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Replaces the entire cart with data from the backend
    setCart: (state, action) => {
      state.items = action.payload;
    },
    // Clears the cart in Redux and localStorage
    clearCartState: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { setCart, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;