import { useEffect } from "react";
import { useDispatch } from "react-redux";
import SummaryApi, { baseURL } from "@config/summaryApi";
import { endUserSession, setUserDetails } from "@store/slices/userSlice";
import { setCart, clearCartState } from "@store/slices/cartSlice";
import { setFavorites, clearFavoritesState } from "@store/slices/favoritesSlice";

// Checks user authentication status on app load
// Automatically refreshes access token when expired using refresh token
export const useAuthCheck = () => {
  // Send actions to update Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    // Call backend logout endpoint to clear HTTP-only cookies
    const serverLogout = async () => {
      // Clear localStorage authentication flag
      // isLoggedIn: Used by ProtectedRoutes & PublicRoutes
      localStorage.removeItem("isLoggedIn");
      await fetch(baseURL + SummaryApi.logout.url, {
        method: SummaryApi.logout.method,
        credentials: "include",
      });
    };

    // Helper function to clear all user session data from Redux
    const handleLogout = async () => {
      await serverLogout();
      dispatch(endUserSession());
      dispatch(clearCartState());
      dispatch(clearFavoritesState());
    };

    // Helper function to update Redux store with user data
    // Extracted to avoid repeating the same mapping in checkAuthStatus and refreshAccessToken
    const setUserState = (userData) => {
      dispatch(
        setUserDetails({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar || "",
          mobile: userData.mobile || null,
          role: userData.role || "User",
          status: userData.status || "Active",
          addresses: userData.addresses || [],
          shopping_cart_items: userData.shopping_cart_items || [],
          orders: userData.orders || [],
        }),
      );
    };

    // Helper function to load cart and favorites from user data into Redux
    const loadUserData = (userData) => {
      // Flatten shopping_cart_items from user data into Redux cart
      const cartItems = userData.shopping_cart_items.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));
      dispatch(setCart(cartItems));
      // Load favorites from user data into Redux
      dispatch(setFavorites(userData.favorites || []));
    };

    const checkAuthStatus = async () => {
      try {
        // Attempt to fetch user details using current access token
        const res = await fetch(baseURL + SummaryApi.userDetails.url, {
          credentials: "include", // Essential for cookie-based authentication
        });

        const data = await res.json();

        // Check if user is authenticated with valid access token
        // Update Redux store if user is authenticated
        if (data.success && data.data) {
          setUserState(data.data);
          loadUserData(data.data);
        }
        // If access token expired (401), attempt to refresh it
        else if (res.status === 401) {
          await refreshAccessToken();
        }
        // Any other error response from server
        else {
          console.log("Authentication failed: ", data.message);
          await handleLogout();
        }
      } catch (error) {
        // Does not clear session on network errors
        console.error("Authentication check error:", error);
      }
    };

    // Refresh access token using refresh token from HTTP-only cookies
    // Called when access token expires (401 response from server)
    const refreshAccessToken = async () => {
      try {
        // Request new access token using refresh token cookie
        const res = await fetch(baseURL + SummaryApi.refreshToken.url, {
          method: SummaryApi.refreshToken.method,
          credentials: "include",
        });

        const data = await res.json();

        // If refresh successful, retry getting user details
        if (data.success && data.data.accessToken) {
          const userRes = await fetch(baseURL + SummaryApi.userDetails.url, {
            credentials: "include",
          });

          const userData = await userRes.json();

          // Store user data in Redux after successful token refresh
          if (userData.success && userData.data) {
            setUserState(userData.data);
            loadUserData(userData.data);
          } else {
            // New token but user data fetch failed
            await handleLogout();
          }
        } else {
          // Refresh token invalid or expired - clear session
          await handleLogout();
        }
      } catch (error) {
        // TypeError indicates a network failure, keep session alive
        // Any other error indicates an auth problem, clear session
        if (error instanceof TypeError) {
          console.error(
            "Network error during token refresh, keeping session:",
            error,
          );
        } else {
          await handleLogout();
        }
      }
    };

    checkAuthStatus();
  }, [dispatch]);
};