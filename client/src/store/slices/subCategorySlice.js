import { createSlice } from "@reduxjs/toolkit";

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState: {
    allSubCategories: [],
  },
  reducers: {
    // Sets the complete list of sub-categories in the global store
    setAllSubCategories: (state, action) => {
      state.allSubCategories = [...action.payload];
    },
  },
});

export const { setAllSubCategories } = subCategorySlice.actions;
export default subCategorySlice.reducer;