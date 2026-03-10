import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Search, SquareUserRound, Menu, X, LogOut } from "lucide-react";
import { Logo, ShoppingCartIcon, Loader } from "@components";
import {ShoppingCart} from "@components/ui/ShoppingCart";
import SummaryApi, { baseURL } from "@config/summaryApi";
import { endUserSession } from "@store/slices/userSlice";

const Header = () => {
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get user state from Redux store
  const userState = useSelector((state) => state.user);
  // Send actions to update Redux store
  const dispatch = useDispatch();

  // Toggle cart visibility
  const handleToggleCart = () => setIsCartOpen(!isCartOpen);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch(baseURL + SummaryApi.logout.url, {
        method: SummaryApi.logout.method,
        credentials: "include",
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        // Clear user from Redux store
        dispatch(endUserSession());
        // Clear localStorage authentication flag
        // isLoggedIn: Used by ProtectedRoutes & PublicRoutes
        localStorage.removeItem("isLoggedIn");
        // Close mobile menu if open
        setIsMobileMenuOpen(false);
        // Redirect to home page
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isLoggedIn = userState._id !== "";

  return (
    <header className="w-full sticky top-0 z-40 bg-white shadow-md p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 grid-rows-[auto_auto] md:grid-rows-1 items-center gap-4 md:gap-0">
        {/* Logo */}
        <Link to="/" className="col-start-1 col-end-2">
          <Logo />
        </Link>

        {/* Search Bar */}
        <div className="flex w-full col-start-1 col-end-3 md:col-start-2 md:col-end-3 row-start-2 md:row-start-1">
          <input
            type="text"
            placeholder="Search product here..."
            className="w-full pl-2 border border-gray-300 outline-none rounded-l-full"
          />
          <div className="flex items-center justify-center w-[50px] h-8 bg-orange-500 text-white rounded-r-full cursor-pointer">
            <Search />
          </div>
        </div>

        {/* Nav container */}
        <nav className="col-start-2 col-end-3 md:col-start-3 md:col-end-4 row-start-1">
          <div className="flex gap-2 justify-end items-center h-9">
            {/* Shopping cart */}
            <ShoppingCartIcon onClick={handleToggleCart} />

            {/* MOBILE VIEW - Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X size="28px" /> : <Menu size="28px" />}
            </button>

            {/* DESKTOP VIEW - User authentication actions */}
            {isLoggedIn ? (
              // Display user profile and logout for authenticated users
              <>
                <SquareUserRound
                  onClick={() => navigate("/dashboard")}
                  size="36px"
                  strokeWidth="1.45"
                  className="cursor-pointer hidden md:block"
                />
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="hidden md:flex items-center justify-center min-w-[100px] px-3 py-1 bg-red-500 font-semibold text-white rounded-sm hover:bg-red-600 hover:scale-105 transition-all duration-300 ease-in-out tracking-wider disabled:opacity-85 cursor-pointer"
                >
                  {loading ? (
                    <Loader />
                  ) : (
                    <div className="flex justify-center items-center gap-1">
                      <LogOut size={22} />
                      Logout
                    </div>
                  )}
                </button>
              </>
            ) : (
                // Display register and login for unauthenticated users
              <>
                <Link
                  to="/login"
                  className="hidden md:block px-3 py-1 font-semibold bg-orange-500 text-white rounded-sm hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out tracking-wider"
                >
                  Login
                </Link>
                <Link
                  to="/sign-up"
                  className="hidden md:block px-3 py-1 font-semibold bg-gray-700 text-white rounded-sm hover:bg-gray-800 hover:scale-105 transition-all duration-300 ease-in-out tracking-wider"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* ShoppingCart Overlay - Hidden by default */}
      <ShoppingCart isOpen={isCartOpen} onClose={handleToggleCart} />
    </header>
  );
};

export default Header;