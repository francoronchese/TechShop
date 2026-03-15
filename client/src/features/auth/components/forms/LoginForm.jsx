import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Input, InputPassword, Loader } from "@components";
import SummaryApi, { baseURL } from "@config/summaryApi";
import { ButtonForm } from "@features/auth";
import { setUserDetails } from "@store/slices/userSlice";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  // Send actions to update Redux store
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(baseURL + SummaryApi.login.url, {
        method: SummaryApi.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include", // Essential for cookie-based authentication
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        // Store authentication flag in localStorage for page refresh persistence
        // Used in: ProtectedRoutes & PublicRoutes
        localStorage.setItem("isLoggedIn", "true");

        // Fetch user data immediately after login
        const userRes = await fetch(baseURL + SummaryApi.userDetails.url, {
          credentials: "include",
        });
        const userData = await userRes.json();

        if (userData.success && userData.data) {
          dispatch(
            setUserDetails({
              _id: userData.data._id,
              name: userData.data.name,
              email: userData.data.email,
              avatar: userData.data.avatar || "",
              mobile: userData.data.mobile || null,
              role: userData.data.role || "User",
              status: userData.data.status || "Active",
              addresses: userData.data.addresses || [],
              shopping_cart_items: userData.data.shopping_cart_items || [],
              orders: userData.data.orders || [],
            }),
          );
        }

        // Clear form
        setFormData({
          email: "",
          password: "",
        });
        // Redirect to home page after successful login
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        label="Email:"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter email"
      />

      <InputPassword
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter password"
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
      />

      <Link
        to="/forgot-password"
        className="ml-auto text-sm text-slate-500 italic hover:underline hover:text-orange-600"
      >
        Forgot password?
      </Link>

      <ButtonForm disabled={!isFormValid} loading={loading} maxWidth={"150px"}>
        {loading ? <Loader /> : "Login"}
      </ButtonForm>

      <p className="text-sm text-slate-500 italic">
        Don't have an account?{" "}
        <Link
          to="/sign-up"
          className="text-orange-500 hover:text-orange-600 hover:underline font-semibold"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
};

export { LoginForm };
