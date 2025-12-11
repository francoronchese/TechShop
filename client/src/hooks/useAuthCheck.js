import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { endUserSession, setUserDetails } from '../store/slices/userSlice';
import SummaryApi, { baseURL } from '../config/summaryApi';

// Checks user authentication status on app load
// Automatically refreshes access token when expired using refresh token
export const useAuthCheck = () => {
  // Send actions to update Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    // Call backend logout endpoint to clear HTTP-only cookies
    const serverLogout = async () => {
      await fetch(baseURL + SummaryApi.logout.url, {
        method: SummaryApi.logout.method,
        credentials: 'include',
      });
    };

    const checkAuthStatus = async () => {
      try {
        // Attempt to fetch user details using current access token
        const res = await fetch(baseURL + SummaryApi.userDetails.url, {
          credentials: 'include', // Essential for cookie-based authentication
        });

        const data = await res.json();

        // Check if user is authenticated with valid access token
        // Update Redux store if user is authenticated
        if (data.success && data.data) {
          dispatch(
            setUserDetails({
              _id: data.data._id,
              name: data.data.name,
              email: data.data.email,
              avatar: data.data.avatar || '',
              mobile: data.data.mobile || null,
              role: data.data.role || 'User',
              status: data.data.status || 'Active',
              addresses: data.data.addresses || [],
              shopping_cart_items: data.data.shopping_cart_items || [],
              orders: data.data.orders || [],
            })
          );
        }
        // If access token expired (401), attempt to refresh it
        else if (res.status === 401) {
          await refreshAccessToken();
        }
        // Any other error response from server
        else {
          console.log('Authentication failed: ', data.message);
          await serverLogout();
          dispatch(endUserSession());
        }
      } catch (error) {
        // Does not clear session on network errors
        console.error('Authentication check error:', error);
      }
    };

    // Refresh access token using refresh token from HTTP-only cookies
    // Called when access token expires (401 response from server)
    const refreshAccessToken = async () => {
      try {
        // Request new access token using refresh token cookie
        const res = await fetch(baseURL + SummaryApi.refreshToken.url, {
          method: SummaryApi.refreshToken.method,
          credentials: 'include',
        });

        const data = await res.json();

        // If refresh successful, retry getting user details
        if (data.success && data.data.accessToken) {
          const userRes = await fetch(baseURL + SummaryApi.userDetails.url, {
            credentials: 'include',
          });

          const userData = await userRes.json();

          // Store user data in Redux after successful token refresh
          if (userData.success && userData.data) {
            dispatch(
              setUserDetails({
                _id: userData.data._id,
                name: userData.data.name,
                email: userData.data.email,
                avatar: userData.data.avatar || '',
                mobile: userData.data.mobile || null,
                role: userData.data.role || 'User',
                status: userData.data.status || 'Active',
                addresses: userData.data.addresses || [],
                shopping_cart_items: userData.data.shopping_cart_items || [],
                orders: userData.data.orders || [],
              })
            );
          } else {
            // New token but user data fetch failed
            await serverLogout();
            dispatch(endUserSession());
          }
        } else {
          // Refresh token invalid or expired
          await serverLogout();
          dispatch(endUserSession());
        }
      } catch (error) {
        // Network error during token refresh - clear session for security
        console.error('Token refresh error:', error);
        await serverLogout();
        dispatch(endUserSession());
      }
    };

    checkAuthStatus();
  }, [dispatch]);
};
