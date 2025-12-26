import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Public route wrapper for unauthenticated routes
export const PublicRoutes = () => {
  // Get current user authentication state from Redux store
  const user = useSelector((state) => state.user);

  // Check authentication using Redux state & sessionStorage
  // Prevents authenticated users from accessing auth pages during page refresh
  // sessionStorage flag is set in LoginForm.jsx (successful login)
  const isAuthenticated =
    user._id || sessionStorage.getItem('isLoggedIn') === 'true';

  // If user is authenticated redirect to home
  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  // If user is not authenticated render public auth routes
  return <Outlet />;
};
