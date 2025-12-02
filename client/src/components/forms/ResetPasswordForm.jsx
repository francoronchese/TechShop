import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InputText from '../inputs/InputText';
import InputPassword from '../inputs/InputPassword';
import toast from 'react-hot-toast';
import SummaryApi, { baseURL } from '../../config/summaryApi';

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate()
  const location = useLocation();

  // Pre-fill email from location state
  useEffect(() => {
    if (location?.state?.email) {
      setFormData((prev) => ({
        ...prev,
        email: location.state.email,
      }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const res = await fetch(baseURL + SummaryApi.resetPassword.url, {
        method: SummaryApi.resetPassword.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        // Redirect to login
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
        });
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Connection error. Please try again later.');
    }
  };

  const isFormValid =
    formData.email && formData.password && formData.confirmPassword;

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <InputText
        label='Email:'
        name='email'
        value={formData.email}
        onChange={handleChange}
        placeholder='enter email'
        readOnly={true}
      />

      <InputPassword
        label='New Password:'
        name='password'
        value={formData.password}
        onChange={handleChange}
        placeholder='enter new password'
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
      />

      <InputPassword
        label='Confirm New Password:'
        name='confirmPassword'
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder='enter confirm new password'
        showPassword={confirmPassword}
        onToggleShowPassword={() => setConfirmPassword(!confirmPassword)}
      />

      <button
        disabled={!isFormValid}
        className={`block w-full max-w-[180px] mx-auto mt-4 mb-6 px-6 py-2 text-[1.05rem] text-white rounded-full ${
          isFormValid
            ? 'bg-orange-600 outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:bg-orange-500 hover:scale-105 transition-all duration-300 ease-in-out tracking-wider cursor-pointer'
            : 'bg-slate-400 cursor-not-allowed'
        }`}
      >
        Change Password
      </button>
    </form>
  );
};

export default ResetPasswordForm;
