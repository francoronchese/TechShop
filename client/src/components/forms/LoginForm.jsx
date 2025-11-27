import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputText from '../inputs/InputText';
import InputPassword from '../inputs/InputPassword';
import toast from 'react-hot-toast';
import SummaryApi, { baseURL } from '../../config/summaryApi';

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
      const response = await fetch(baseURL + SummaryApi.login.url, {
        method: SummaryApi.login.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

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

      <button
        disabled={!isFormValid}
        className={`block w-full max-w-[150px] mx-auto my-6 px-6 py-1.5 text-[1.05rem] text-white rounded-full ${
          isFormValid
            ? 'bg-orange-600 hover:bg-orange-500 hover:scale-105 transition-all duration-300 ease-in-out tracking-wider cursor-pointer'
            : 'bg-slate-400 cursor-not-allowed'
        }`}
      >
        Login
      </button>

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
