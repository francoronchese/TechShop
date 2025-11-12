import { useState } from 'react';
import { Link } from 'react-router-dom';
import InputText from '../inputs/InputText';
import InputPassword from '../inputs/InputPassword';

const LoginForm = () => {
  const [password, setPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) return alert('Email and password are required');
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <InputText
        label='Email:'
        name='email'
        value={formData.email}
        onChange={handleChange}
        placeholder='enter email'
      />

      <InputPassword
        label='Password'
        name='password'
        value={formData.password}
        onChange={handleChange}
        placeholder='enter password'
        showPassword={password}
        onTogglePassword={() => setPassword(!password)}
      />

      <Link
        to='/forgot-password'
        className='ml-auto text-sm text-gray-600 hover:underline hover:text-orange-600'
      >
        Forgot password?
      </Link>

      <button className='block w-full max-w-[150px] mx-auto my-6 px-6 py-1.5 text-[1.05rem] bg-orange-600 text-white rounded-full hover:bg-orange-500 hover:scale-110 transition-all delay-150 duration-300 ease-in-out'>
        Login
      </button>

      <p className='text-sm text-gray-600'>
        Don't have an account?{' '}
        <Link
          to='/sign-up'
          className='text-orange-500 hover:text-orange-600 hover:underline font-medium'
        >
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
