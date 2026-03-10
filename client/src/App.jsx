import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import HomePage from "@pages/HomePage";
import AllProductsPage from "@pages/AllProductsPage";
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
} from "@features/dashboard";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";

function App() {
  // Check authentication on app load and page refresh
  useAuthCheck();

  return (
    <>
      <Toaster />
      <Header />
      <main className="min-h-[calc(100vh-128px)] md:min-h-[calc(100vh-148px)] p-6 bg-slate-100">
        <Routes>
          {/* Public Routes without auth check */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

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
            {/* Dashboard routes*/}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route
                index
                element={<Navigate to="/dashboard/profile" replace />}
              />
              <Route path="profile" element={<ProfilePage />} />
              {/* <Route path='orders' element={<OrdersPage />} /> */}
              {/* <Route path='favorites' element={<FavoritesPage />} /> */}
              {/* <Route path='addresses' element={<AddressesPage />} /> */}
              <Route path="categories" element={<CategoryPage />} />
              <Route path="sub-categories" element={<SubCategoryPage />} />
              <Route path="products" element={<ProductPage />} />
            </Route>
          </Route>

          {/* 404 Error */}
          <Route path="*" element={<h2>404</h2>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
