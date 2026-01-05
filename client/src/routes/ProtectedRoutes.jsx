import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Protected route wrapper for authenticated routes
export const ProtectedRoutes = () => {
  // Get current user authentication state from Redux store
  const user = useSelector((state) => state.user);

  // Check authentication using Redux state & localStorage
  // localStorage prevents redirects during page refresh while Redux rehydrates
  // localStorage flag is set in LoginForm.jsx (successful login)
  const isAuthenticated =
    user._id || localStorage.getItem('isLoggedIn') === 'true';

  // If user is not authenticated redirect to login
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  // If user is authenticated render protected routes
  return <Outlet />;
};
