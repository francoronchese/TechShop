import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';

// Centralized Redux store for global state management
const store = configureStore({
  reducer: {
    user: userReducer, // Manages authentication and user profile data
  },
});

export default store;
