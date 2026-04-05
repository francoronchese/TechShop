import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import HomePage from "@pages/HomePage";
import AllProductsPage from "@pages/AllProductsPage";
import ProductsByCategoryPage from "@pages/ProductsByCategoryPage";
import SingleProductPage from "@pages/SingleProductPage";
import NotFoundPage from "@pages/NotFoundPage";
import CheckoutPage from "@pages/CheckoutPage";
import OrderSuccessPage from "@pages/OrderSuccessPage";
import { PageLoader } from "@components";
import {
  LoginPage,
  SignUpPage,
  ForgotPasswordPage,
  OTPVerificationPage,
  ResetPasswordPage,
  VerifyEmailPage,
  useAuthCheck,
} from "@features/auth";
import {
  DashboardLayout,
  ProfilePage,
  CategoryPage,
  SubCategoryPage,
  ProductPage,
  FavoritesPage,
  AddressesPage,
  OrdersPage,
  OrderDetailPage,
  AdminOrdersPage,
  UsersPage,
  UserDetailPage,
} from "@features/dashboard";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";

function App() {
  // Check authentication on app load and page refresh
  // isChecking is true while the auth check is in progress
  const { isChecking } = useAuthCheck();

  // Show global loader while auth check resolves
  // Prevents blank screens while the backend wakes up on Render
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Header />
      <main className="min-h-screen p-6 bg-slate-100">
        <Routes>
          {/* Public Routes without auth check */}
          <Route path="/" element={<HomePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route
            path="/category/:categoryId"
            element={<ProductsByCategoryPage />}
          />
          <Route path="/product/:id" element={<SingleProductPage />} />

          {/* Public Routes with auth check */}
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/forgot-password-verification"
              element={<OTPVerificationPage />}
            />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            {/* Dashboard routes*/}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route
                index
                element={<Navigate to="/dashboard/profile" replace />}
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
              <Route path="all-orders" element={<AdminOrdersPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="addresses" element={<AddressesPage />} />
              <Route path="categories" element={<CategoryPage />} />
              <Route path="sub-categories" element={<SubCategoryPage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
            </Route>
          </Route>

          {/* 404 Error */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
