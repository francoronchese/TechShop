import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import ForgotPasswordPage from './pages/forgotPassword';
import SignUpPage from './pages/signUp';
import OTPVerificationPage from './pages/otpVerification';
import ResetPasswordPage from './pages/resetPassword';
import VerifyEmailPage from './pages/verifyEmail';
import { useAuthCheck } from './hooks/useAuthCheck';

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
