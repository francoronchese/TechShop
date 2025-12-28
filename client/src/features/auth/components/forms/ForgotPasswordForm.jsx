import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SummaryApi, { baseURL } from '@config/summaryApi';
import { Input, Loader } from '@components';
import { ButtonForm } from '@features/auth';

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <legend className='text-2xl font-bold mb-2'>Forgot Password</legend>

      <Input
        label='Email:'
        name='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='enter your registered email'
      />

      <ButtonForm disabled={!email} loading={loading} maxWidth={'180px'}>
        {loading ? <Loader /> : 'Reset Password'}
      </ButtonForm>

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

export { ForgotPasswordForm };
