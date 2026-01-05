import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input, InputPassword, Loader } from '@components';
import SummaryApi, { baseURL } from '@config/summaryApi';
import uploadToCloudinary from '@helpers/cloudinaryUpload';
import { ButtonForm } from '@features/auth';

const SignUpForm = ({ profileImage = '' }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: profileImage,
  });
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      profileImage: profileImage,
    }));
  }, [profileImage]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image to Cloudinary if user selected one
      const avatarUrl = profileImage
        ? await uploadToCloudinary(
            profileImage,
            import.meta.env.VITE_CLOUDINARY_PRESET_AVATARS
          )
        : '';

      const res = await fetch(baseURL + SummaryApi.register.url, {
        method: SummaryApi.register.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          avatar: avatarUrl, // Cloudinary URL or empty string
        }),
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          profileImage: '',
        });
        // Redirect to login page after successful registration
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword;

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <Input
        label='Name:'
        name='name'
        value={formData.name}
        onChange={handleChange}
        placeholder='enter your name'
      />

      <Input
        label='Email:'
        name='email'
        value={formData.email}
        onChange={handleChange}
        placeholder='enter email'
      />

      <InputPassword
        label='Password:'
        name='password'
        value={formData.password}
        onChange={handleChange}
        placeholder='enter password'
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
      />

      <InputPassword
        label='Confirm Password:'
        name='confirmPassword'
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder='enter confirm password'
        showPassword={confirmPassword}
        onToggleShowPassword={() => setConfirmPassword(!confirmPassword)}
      />

      <ButtonForm disabled={!isFormValid} loading={loading} maxWidth={'150px'}>
        {loading ? <Loader /> : 'Sign Up'}
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

export { SignUpForm };
