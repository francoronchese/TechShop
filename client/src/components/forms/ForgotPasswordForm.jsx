import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputText from '../inputs/InputText';
import toast from 'react-hot-toast';
import SummaryApi, { baseURL } from '../../config/summaryApi';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(baseURL + SummaryApi.forgotPassword.url, {
        method: SummaryApi.forgotPassword.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success('Password reset OTP sent to your email');
        // Redirect to OTP verification page with email in state
        setEmail('');
        navigate('/forgot-password-verification', { state: { email } });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Connection error. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <legend className='text-lg font-semibold mb-3'>Forgot Password</legend>

      <InputText
        label='Email:'
        name='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='enter your registered email'
      />

      <button
        type='submit'
        disabled={!email}
        className={`block w-full max-w-[180px] mx-auto mt-4 mb-6 px-6 py-2 text-[1.05rem] text-white rounded-full ${
          email
            ? 'bg-orange-600 outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:bg-orange-500 hover:scale-105 transition-all duration-300 ease-in-out tracking-wider cursor-pointer'
            : 'bg-slate-400 cursor-not-allowed'
        }`}
      >
        Reset Password
      </button>

      <p className='text-sm text-gray-600'>
        Already have an account?{' '}
        <Link
          to='/login'
          className='text-orange-500 hover:text-orange-600 hover:underline font-semibold'
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
