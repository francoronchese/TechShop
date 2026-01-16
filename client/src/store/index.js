import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import categoryReducer from "./slices/categorySlice";
import subCategoryReducer from "./slices/subCategorySlice";

// Centralized Redux store for global state management
const store = configureStore({
  reducer: {
    user: userReducer, // Manages authentication and user profile data
    category: categoryReducer,
    subCategory: subCategoryReducer,
  },
});

export default store;
