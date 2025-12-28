import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import SummaryApi, { baseURL } from '@config/summaryApi';
import { ButtonForm } from '@features/auth';
import { Loader } from '@components';

const OtpVerificationForm = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if email is not provided in location state
  useEffect(() => {
    if (!location?.state?.email) {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleChange = (index, value) => {
    // Allow only numeric digits (0-9) for OTP input
    if (value && !/^\d*$/.test(value)) return;

    // Create a copy of the current OTP array to avoid direct state mutation
    // Update the specific OTP digit at the given index
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input when current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key to move focus to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        baseURL + SummaryApi.forgotPasswordVerification.url,
        {
          method: SummaryApi.forgotPasswordVerification.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            otp: otp.join(''),
            email: location.state.email,
          }),
        }
      );

      const data = await res.json();

      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        // Clear OTP inputs after successful verification
        setOtp(['', '', '', '', '', '']);
        // Redirect to reset password page with email in state
        navigate('/reset-password', {
          state: { email: location.state.email },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Check if all 6 OTP digits are entered
  const isOtpComplete = otp.join('').length === 6;

  return (
    <form onSubmit={handleSubmit}>
      <legend className='text-2xl font-bold mb-2'>Verify OTP</legend>

      <p className='text-gray-600 mb-4'>
        Enter the 6-digit OTP sent to your email
      </p>

      <div className='grid grid-cols-6 gap-2'>
        {otp.map((digit, index) => (
          <input
            key={index}
            type='text'
            value={digit}
            // Store reference to this input for focus control
            ref={(ref) => (inputRefs.current[index] = ref)}
            // Update OTP array with new digit at specific index
            onChange={(e) => handleChange(index, e.target.value)}
            // Handle backspace navigation between inputs
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            className='p-2 bg-slate-100 text-center text-xl font-bold outline-none rounded focus:border-orange-500 focus:ring-2 focus:ring-orange-500'
          />
        ))}
      </div>

      <ButtonForm
        disabled={!isOtpComplete}
        loading={loading}
        maxWidth={'180px'}
      >
        {loading ? <Loader /> : 'Verify OTP'}
      </ButtonForm>

      <p className='text-sm text-gray-600'>
        Didn't receive the code?{' '}
        <Link
          to='/forgot-password'
          className='text-orange-500 hover:text-orange-600 hover:underline font-semibold'
        >
          Resend OTP
        </Link>
      </p>
    </form>
  );
};

export { OtpVerificationForm };
