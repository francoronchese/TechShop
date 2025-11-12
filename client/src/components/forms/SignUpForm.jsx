import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InputText from '../inputs/InputText';
import InputPassword from '../inputs/InputPassword';

const SignUpForm = ({ profileImage = '' }) => {
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: profileImage,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return alert('All fields required');
    }

    if (password !== confirmPassword) {
      return alert('Passwords do not match');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <InputText
        label='Name:'
        name='name'
        value={formData.name}
        onChange={handleChange}
        placeholder='enter your name'
      />

      <InputText
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
        showPassword={password}
        onTogglePassword={() => setPassword(!password)}
      />

      <InputPassword
        label='Confirm Password:'
        name='confirmPassword'
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder='enter confirm password'
        showPassword={confirmPassword}
        onTogglePassword={() => setConfirmPassword(!confirmPassword)}
      />

      <button className='block w-full max-w-[150px] mx-auto my-6 px-6 py-1.5 text-[1.05rem] bg-orange-600 text-white rounded-full hover:bg-orange-500 hover:scale-110 transition-all delay-150 duration-300 ease-in-out'>
        Sign Up
      </button>

      <p className='text-sm text-gray-600'>
        Already have an account?{' '}
        <Link
          to='/login'
          className='text-orange-500 hover:text-orange-600 hover:underline font-medium'
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;
