import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    allCategories: [],
  },
  reducers: {
    // Sets the complete list of categories in the global store
    setAllCategories: (state, action) => {
      state.allCategories = [...action.payload];
    },
  },
});

export const { setAllCategories } = categorySlice.actions;
export default categorySlice.reducer;
