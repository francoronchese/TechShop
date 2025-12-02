export const baseURL = 'http://localhost:8080';

const SummaryApi = {
  register: {
    url: '/api/user/register',
    method: 'POST',
  },
  login: {
    url: '/api/user/login',
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
