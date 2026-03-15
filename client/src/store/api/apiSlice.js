import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import SummaryApi, { baseURL } from "@config/summaryApi";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    credentials: "include",
  }),
  // Tags used to control the automated re-fetching logic
  tagTypes: ["Product", "Category", "SubCategory"],
  endpoints: (builder) => ({
    // PRODUCT ENDPOINTS
    // GET: Fetches products with optional pagination and search filters
    getProducts: builder.query({
      // Destructure page and search from the argument object
      query: ({
        page,
        search,
        limit,
        categoryId,
        subCategoryId,
        sortBy,
        priceMin,
        priceMax,
      }) => ({
        url: SummaryApi.getAllProducts.url,
        params: {
          page: page || 1,
          search: search || "",
          ...(limit && { limit }),
          ...(categoryId && { categoryId }),
          ...(subCategoryId && { subCategoryId }),
          ...(sortBy && { sortBy }),
          ...(priceMin && { priceMin }),
          ...(priceMax && { priceMax }),
        },
      }),
      // transformResponse is omitted to keep pagination metadata (totalPages, totalCount) accessible in the component
      providesTags: ["Product"],
    }),

    // GET: Fetches a single product by its ID
    getProductById: builder.query({
      query: (id) => SummaryApi.getProduct.url.replace(":id", id),
      transformResponse: (res) => res.data,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    // POST/PUT: Handles both creation and updates for products
    // Automatically selects the correct endpoint based on the presence of _id
    saveProduct: builder.mutation({
      query: (body) => ({
        url: body._id
          ? SummaryApi.updateProduct.url
          : SummaryApi.createProduct.url,
        method: body._id
          ? SummaryApi.updateProduct.method
          : SummaryApi.createProduct.method,
        body,
      }),
      // Invalidates "Product" tag to trigger an automatic refresh of the product list
      invalidatesTags: ["Product"],
    }),
    // DELETE: Removes a product by its ID
    deleteProduct: builder.mutation({
      query: (body) => ({
        url: SummaryApi.deleteProduct.url,
        method: SummaryApi.deleteProduct.method,
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    // CATEGORY ENDPOINTS
    // GET: Fetches the complete list of categories
    getCategories: builder.query({
      query: () => SummaryApi.getAllCategories.url,
      transformResponse: (res) => res.data,
      providesTags: ["Category"],
    }),
    // POST/PUT: Handles both creation and updates
    // Automatically selects the correct endpoint based on the presence of _id
    saveCategory: builder.mutation({
      query: (body) => ({
        url: body._id
          ? SummaryApi.updateCategory.url
          : SummaryApi.createCategory.url,
        method: body._id
          ? SummaryApi.updateCategory.method
          : SummaryApi.createCategory.method,
        body,
      }),
      // Invalidates the tag to trigger an automatic refresh of getCategories
      invalidatesTags: ["Category"],
    }),
    // DELETE: Removes a category by its ID
    deleteCategory: builder.mutation({
      query: (body) => ({
        url: SummaryApi.deleteCategory.url,
        method: SummaryApi.deleteCategory.method,
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    // SUB-CATEGORY ENDPOINTS
    // GET: Fetches the complete list of sub-categories
    getSubCategories: builder.query({
      query: () => SummaryApi.getAllSubCategories.url,
      transformResponse: (res) => res.data,
      providesTags: ["SubCategory"],
    }),
    // POST/PUT: Handles both creation and updates
    // Automatically selects the correct endpoint based on the presence of _id
    saveSubCategory: builder.mutation({
      query: (body) => ({
        url: body._id
          ? SummaryApi.updateSubCategory.url
          : SummaryApi.createSubCategory.url,
        method: body._id
          ? SummaryApi.updateSubCategory.method
          : SummaryApi.createSubCategory.method,
        body,
      }),
      // Invalidates the tag to trigger an automatic refresh of getSubCategories
      invalidatesTags: ["SubCategory"],
    }),
    // DELETE: Removes a sub-category by its ID
    deleteSubCategory: builder.mutation({
      query: (body) => ({
        url: SummaryApi.deleteSubCategory.url,
        method: SummaryApi.deleteSubCategory.method,
        body,
      }),
      invalidatesTags: ["SubCategory"],
    }),
  }),
});

export const {
  // Product hooks
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSaveProductMutation,
  useDeleteProductMutation,
  // Category hooks
  useGetCategoriesQuery,
  useSaveCategoryMutation,
  useDeleteCategoryMutation,
  // Sub-category hooks
  useGetSubCategoriesQuery,
  useSaveSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = apiSlice;
