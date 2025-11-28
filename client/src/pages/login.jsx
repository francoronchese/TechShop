import { CircleUserRound } from 'lucide-react';
import LoginForm from '../components/forms/LoginForm';

const LoginPage = () => {
  return (
    <section className='max-w-md mx-auto px-2 py-6 bg-white'>
      <CircleUserRound
        size='80px'
        strokeWidth='0.85'
        className='mx-auto text-orange-600'
      />

      <LoginForm />
    </section>
  );
};

export default LoginPage;
