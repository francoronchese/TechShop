import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // Replaces the entire favorites list with data from the backend
    setFavorites: (state, action) => {
      state.items = action.payload;
    },
    // Clears the favorites list
    clearFavoritesState: (state) => {
      state.items = [];
    },
  },
});

export const { setFavorites, clearFavoritesState } = favoritesSlice.actions;
export default favoritesSlice.reducer;
