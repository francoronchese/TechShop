import { CircleUserRound } from 'lucide-react';
import { LoginForm } from '../components/forms/LoginForm.jsx';

export const LoginPage = () => {
  return (
    <section className='max-w-md mx-auto px-3 py-6 bg-white rounded-xl border border-slate-300'>
      <CircleUserRound
        size='80px'
        strokeWidth='0.85'
        className='mx-auto text-orange-600'
      />

      <LoginForm />
    </section>
  );
};
