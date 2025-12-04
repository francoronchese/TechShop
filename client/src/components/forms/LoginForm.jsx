import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputText from '../inputs/InputText';
import InputPassword from '../inputs/InputPassword';
import toast from 'react-hot-toast';
import SummaryApi, { baseURL } from '../../config/summaryApi';
import ButtonForm from '../buttons/ButtonForm';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <InputText
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

      <ButtonForm disabled={!isFormValid} maxWidth={'150px'}>
        Login
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

export default LoginForm;
