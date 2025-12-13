import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import ForgotPasswordPage from '@pages/ForgotPasswordPage';
import SignUpPage from '@pages/SignUpPage';
import OTPVerificationPage from '@pages/OtpVerificationPage';
import ResetPasswordPage from '@pages/ResetPasswordPage';
import VerifyEmailPage from '@pages/VerifyEmailPage';
import { useAuthCheck } from '@features/auth';

function App() {
  // Check authentication on app load and page refresh
  useAuthCheck();

  return (
    <>
      <Toaster />
      <Header />
      <main className='min-h-[calc(100vh-128px)] md:min-h-[calc(100vh-148px)] p-6 bg-slate-100'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/verify-email' element={<VerifyEmailPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route
            path='/forgot-password-verification'
            element={<OTPVerificationPage />}
          />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='*' element={<h2>404</h2>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
