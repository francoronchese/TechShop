// API configuration file
// Defines all backend endpoints and base URLs for development and production
export const baseURL = import.meta.env.DEV
  ? '' // Empty string during development - Vite proxy handles the /api prefix
  : 'http://localhost:8080'; // Direct backend URL for production (includes /api in endpoint URLs)

const SummaryApi = {
  register: {
    url: '/api/user/register',
    method: 'POST',
  },
  login: {
    url: '/api/user/login',
    method: 'POST',
  },
  verifyEmail: {
    url: '/api/user/verify-email',
    method: 'POST',
  },
  forgotPassword: {
    url: '/api/user/forgot-password',
    method: 'POST',
  },
  forgotPasswordVerification: {
    url: '/api/user/verify-forgot-password-otp',
    method: 'POST',
  },
  resetPassword: {
    url: '/api/user/reset-password',
    method: 'PUT',
  },
};

export default SummaryApi;
