import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import SummaryApi, { baseURL } from "@config/summaryApi";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    credentials: "include",
  }),
  // Tags used to control the automated re-fetching logic
  tagTypes: [
    "Product",
    "Category",
    "SubCategory",
    "Cart",
    "Address",
    "Order",
    "Favorites",
  ],
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

    // CART ENDPOINTS
    // GET: Fetches the cart items for the authenticated user
    getCart: builder.query({
      query: () => SummaryApi.getCart.url,
      transformResponse: (res) => res.data,
      providesTags: ["Cart"],
    }),
    // POST: Adds a product to the cart
    addToCart: builder.mutation({
      query: (body) => ({
        url: SummaryApi.addToCart.url,
        method: SummaryApi.addToCart.method,
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    // PUT: Increments or decrements the quantity of a cart item
    updateCartQuantity: builder.mutation({
      query: (body) => ({
        url: SummaryApi.updateCartQuantity.url,
        method: SummaryApi.updateCartQuantity.method,
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    // DELETE: Removes a product from the cart
    removeFromCart: builder.mutation({
      query: (body) => ({
        url: SummaryApi.removeFromCart.url,
        method: SummaryApi.removeFromCart.method,
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    // DELETE: Clears all items from the cart
    clearCart: builder.mutation({
      query: () => ({
        url: SummaryApi.clearCart.url,
        method: SummaryApi.clearCart.method,
      }),
      invalidatesTags: ["Cart"],
    }),
    // POST: Merges local cart with backend cart on login
    mergeCart: builder.mutation({
      query: (body) => ({
        url: SummaryApi.mergeCart.url,
        method: SummaryApi.mergeCart.method,
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ADDRESS ENDPOINTS
    // GET: Fetches all addresses for the authenticated user
    getAddresses: builder.query({
      query: () => SummaryApi.getAddresses.url,
      transformResponse: (res) => res.data,
      providesTags: ["Address"],
    }),
    // POST: Adds a new address for the authenticated user
    addAddress: builder.mutation({
      query: (body) => ({
        url: SummaryApi.addAddress.url,
        method: SummaryApi.addAddress.method,
        body,
      }),
      invalidatesTags: ["Address"],
    }),
    // DELETE: Removes an address by its ID
    deleteAddress: builder.mutation({
      query: (body) => ({
        url: SummaryApi.deleteAddress.url,
        method: SummaryApi.deleteAddress.method,
        body,
      }),
      invalidatesTags: ["Address"],
    }),

    // ORDER ENDPOINTS
    // POST: Creates a new order
    createOrder: builder.mutation({
      query: (body) => ({
        url: SummaryApi.createOrder.url,
        method: SummaryApi.createOrder.method,
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    // POST: Creates a Stripe checkout session and returns the URL
    createCheckoutSession: builder.mutation({
      query: (body) => ({
        url: SummaryApi.createCheckoutSession.url,
        method: SummaryApi.createCheckoutSession.method,
        body,
      }),
    }),
    // POST: Confirms a Stripe order after successful payment
    confirmStripeOrder: builder.mutation({
      query: (body) => ({
        url: SummaryApi.confirmStripeOrder.url,
        method: SummaryApi.confirmStripeOrder.method,
        body,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),
    // GET: Fetches all orders for the authenticated user
    getOrders: builder.query({
      query: () => SummaryApi.getOrders.url,
      transformResponse: (res) => res.data,
      providesTags: ["Order"],
    }),
    // GET: Fetches a single order by its ID
    getOrderById: builder.query({
      query: (id) => SummaryApi.getOrderById.url.replace(":id", id),
      transformResponse: (res) => res.data,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    // GET: Fetches all orders (Admin only)
    getAllOrders: builder.query({
      query: () => SummaryApi.getAllOrders.url,
      transformResponse: (res) => res.data,
      providesTags: ["Order"],
    }),
    // PUT: Updates order status (Admin only)
    updateOrderStatus: builder.mutation({
      query: (body) => ({
        url: SummaryApi.updateOrderStatus.url,
        method: SummaryApi.updateOrderStatus.method,
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    // FAVORITES ENDPOINTS
    // GET: Fetches all favorites for the authenticated user
    getFavorites: builder.query({
      query: () => SummaryApi.getFavorites.url,
      transformResponse: (res) => res.data,
      providesTags: ["Favorites"],
    }),
    // POST: Adds a product to favorites
    addToFavorites: builder.mutation({
      query: (body) => ({
        url: SummaryApi.addToFavorites.url,
        method: SummaryApi.addToFavorites.method,
        body,
      }),
      invalidatesTags: ["Favorites"],
    }),
    // DELETE: Removes a product from favorites
    removeFromFavorites: builder.mutation({
      query: (body) => ({
        url: SummaryApi.removeFromFavorites.url,
        method: SummaryApi.removeFromFavorites.method,
        body,
      }),
      invalidatesTags: ["Favorites"],
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
  // Cart hooks
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useMergeCartMutation,
  // Address hooks
  useGetAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  // Order hooks
  useCreateOrderMutation,
  useCreateCheckoutSessionMutation,
  useConfirmStripeOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  // Favorites hooks
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = apiSlice;
