import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/slices/userSlice';
import SummaryApi, { baseURL } from '../config/summaryApi';

// Checks user authentication status on app load
export const useAuthCheck = () => {
  // Send actions to update Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch(baseURL + SummaryApi.userDetails.url, {
          credentials: 'include',
        });

        const data = await res.json();

        // Update Redux store if user is authenticated
        if (data.success && data.data) {
          dispatch(
            setUserDetails({
              _id: data.data._id,
              name: data.data.name,
              email: data.data.email,
            })
          );
        }
      } catch (error) {
        console.error('Authentication check error:', error);
      }
    };

    checkAuthStatus();
  }, [dispatch]);
};
