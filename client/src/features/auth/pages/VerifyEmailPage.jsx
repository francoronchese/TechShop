import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import SummaryApi, { baseURL } from '@config/summaryApi';

export const VerifyEmailPage = () => {
  // Extract userId from URL query parameters
  // Example: http://localhost:5173/verify-email?userId=507f1f77bcf86cd799439011
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  const isVerified = useRef(false); // To prevent duplicate verification attempts

  useEffect(() => {
    // Skip if already attempted verification or no userId
    if (isVerified.current) return;
    if (!userId) {
      navigate('/');
      return;
    }

    // Ensures verification runs only once
    isVerified.current = true;

    const verifyEmail = async () => {
      try {
        const res = await fetch(baseURL + SummaryApi.verifyEmail.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();

        // Display backend response messages
        if (data.success) {
          toast.success('Email verified successfully!');
          // Redirect to login page after successful verification
          setTimeout(() => navigate('/login'), 3000);
        } else {
          toast.error(data.message);
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Connection error. Please try again later.');
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setLoading(false);
      }
    };

    // Only verify if userId exists in URL parameters
    if (userId) verifyEmail();
    else navigate('/');
  }, [userId, navigate]);

  return (
    <section className='max-w-md mx-auto px-3 py-6 bg-white text-center rounded-xl border border-slate-300'>
      <h1 className='mb-4 text-2xl font-bold text-slate-900'>Email Verification</h1>
      {loading ? (
        <p className='text-slate-600'>Verifying your email address...</p>
      ) : (
        <div>
          <p className='text-green-600 font-semibold mb-2'>✓ Email Verified</p>
          <p className='text-slate-600'>Redirecting to login page...</p>
        </div>
      )}
    </section>
  );
};
