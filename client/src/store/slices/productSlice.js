import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    allProducts: [],
  },
  reducers: {
    // Sets the complete list of products in the global store
    setAllProducts: (state, action) => {
      state.allProducts = [...action.payload];
    },
  },
});

export const { setAllProducts } = productSlice.actions;
export default productSlice.reducer;