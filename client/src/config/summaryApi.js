// API configuration file
// Defines all backend endpoints and base URLs for development and production
export const baseURL = import.meta.env.DEV
  ? "" // Empty string during development - Vite proxy handles the /api prefix
  : "http://localhost:8080"; // Direct backend URL for production (includes /api in endpoint URLs)

const SummaryApi = {
  // USER ENDPOINTS
  register: {
    url: "/api/user/register",
    method: "POST",
  },
  login: {
    url: "/api/user/login",
    method: "POST",
  },
  verifyEmail: {
    url: "/api/user/verify-email",
    method: "POST",
  },
  forgotPassword: {
    url: "/api/user/forgot-password",
    method: "POST",
  },
  forgotPasswordVerification: {
    url: "/api/user/verify-forgot-password-otp",
    method: "POST",
  },
  resetPassword: {
    url: "/api/user/reset-password",
    method: "PUT",
  },
  logout: {
    url: "/api/user/logout",
    method: "POST",
  },
  userDetails: {
    url: "/api/user/user-details",
    method: "GET",
  },
  updateProfile: {
    url: "/api/user/update-profile",
    method: "PUT",
  },
  refreshToken: {
    url: "/api/user/refresh-token",
    method: "POST",
  },
  deleteAccount: {
    url: "/api/user/delete-account",
    method: "DELETE",
  },

  // CATEGORY ENDPOINTS
  createCategory: {
    url: "/api/category/create",
    method: "POST",
  },
  getAllCategories: {
    url: "/api/category/get",
    method: "GET",
  },
  updateCategory: {
    url: "/api/category/update",
    method: "PUT",
  },
  deleteCategory: {
    url: "/api/category/delete",
    method: "DELETE",
  },

  // SUB-CATEGORY ENDPOINTS
  createSubCategory: {
    url: "/api/sub-category/create",
    method: "POST",
  },
  getAllSubCategories: {
    url: "/api/sub-category/get",
    method: "GET",
  },
  updateSubCategory: {
    url: "/api/sub-category/update",
    method: "PUT",
  },
  deleteSubCategory: {
    url: "/api/sub-category/delete",
    method: "DELETE",
  },

  // PRODUCT ENDPOINTS
  createProduct: {
    url: "/api/product/create",
    method: "POST",
  },
  getAllProducts: {
    url: "/api/product/get",
    method: "GET",
  },
  getProduct: {
    url: "/api/product/get/:id",
    method: "GET",
  },
  updateProduct: {
    url: "/api/product/update",
    method: "PUT",
  },
  deleteProduct: {
    url: "/api/product/delete",
    method: "DELETE",
  },

  // CART ENDPOINTS
  getCart: {
    url: "/api/cart/get",
    method: "GET",
  },
  addToCart: {
    url: "/api/cart/add",
    method: "POST",
  },
  updateCartQuantity: {
    url: "/api/cart/update-quantity",
    method: "PUT",
  },
  removeFromCart: {
    url: "/api/cart/remove",
    method: "DELETE",
  },
  clearCart: {
    url: "/api/cart/clear",
    method: "DELETE",
  },
  mergeCart: {
    url: "/api/cart/merge",
    method: "POST",
  },
};

export default SummaryApi;
