import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Input, InputPassword, Loader } from '@components';
import SummaryApi, { baseURL } from '@config/summaryApi';
import { ButtonForm } from '@features/auth';
import { setUserDetails } from '@store/slices/userSlice';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include', // Essential for cookie-based authentication
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);

        // Update Redux store with authenticated user data
        dispatch(
          setUserDetails({
            _id: data.data.user.id,
            name: data.data.user.name,
            email: data.data.user.email,
            avatar: '',
            mobile: null,
            role: 'User',
            status: 'Active',
            addresses: [],
            shopping_cart_items: [],
            orders: [],
          })
        );

        // Store authentication flag in localStorage for page refresh persistence
        // Used in: ProtectedRoutes & PublicRoutes
        localStorage.setItem('isLoggedIn', 'true');

        // Clear form
        setFormData({
          email: '',
          password: '',
        });
        // Redirect to home page after successful login
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <Input
        label='Email:'
        name='email'
        value={formData.email}
        onChange={handleChange}
        placeholder='enter email'
      />

      <InputPassword
        label='Password'
        name='password'
        value={formData.password}
        onChange={handleChange}
        placeholder='enter password'
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
      />

      <Link
        to='/forgot-password'
        className='ml-auto text-sm text-gray-600 hover:underline hover:text-orange-600'
      >
        Forgot password?
      </Link>

      <ButtonForm disabled={!isFormValid} loading={loading} maxWidth={'150px'}>
        {loading ? <Loader /> : 'Login'}
      </ButtonForm>

      <p className='text-sm text-gray-600'>
        Don't have an account?{' '}
        <Link
          to='/sign-up'
          className='text-orange-500 hover:text-orange-600 hover:underline font-semibold'
        >
          Sign up
        </Link>
      </p>
    </form>
  );
};

export { LoginForm };
