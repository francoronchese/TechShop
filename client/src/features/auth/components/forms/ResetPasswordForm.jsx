import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { InputText, InputPassword } from '@components/ui';
import SummaryApi, { baseURL } from '@config/summaryApi';
import {ButtonForm} from '@features/auth';

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
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
      <legend className='text-2xl font-bold mb-2'>Reset Your Password</legend>

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

      <ButtonForm disabled={!isFormValid} maxWidth={'180px'}>
        Reset Password
      </ButtonForm>
    </form>
  );
};

export {ResetPasswordForm};
