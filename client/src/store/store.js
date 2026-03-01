import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";

// Centralized Redux store for global state management
const store = configureStore({
  reducer: {
    user: userReducer, // Manages authentication and user profile data
    cart: cartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
