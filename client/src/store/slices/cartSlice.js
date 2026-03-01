import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage or start empty
const savedCart = localStorage.getItem("cartItems");
const initialState = {
  items: savedCart ? JSON.parse(savedCart) : [],
};

// Helper function to sync with localStorage
const syncStorage = (items) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Add product with initial quantity of 1
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id,
      );
      if (!existingItem) {
        state.items.push({ ...action.payload, quantity: 1 });
        syncStorage(state.items);
      }
    },
    incrementQuantity: (state, action) => {
      // Increase quantity only if it does not exceed stock
      const item = state.items.find((item) => item._id === action.payload);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        syncStorage(state.items);
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item && item.quantity > 1) {
        // Decrease quantity if above one
        item.quantity -= 1;
      } else if (item) {
        // Remove item from cart if quantity is one
        state.items = state.items.filter((i) => i._id !== action.payload);
      }
      syncStorage(state.items);
    },
    removeFromCart: (state, action) => {
      // Directly remove product from the cart
      state.items = state.items.filter((item) => item._id !== action.payload);
      syncStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
