import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

import userReducer from "./slices/userSlice";

// Centralized Redux store for global state management
const store = configureStore({
  reducer: {
    user: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
