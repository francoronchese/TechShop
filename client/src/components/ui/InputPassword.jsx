import { Eye, EyeOff } from 'lucide-react';

export const InputPassword = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  onToggleShowPassword,
}) => {
  return (
    <div className='grid gap-1.5'>
      <label className='font-semibold text-orange-500' htmlFor={name}>
        {label}{' '}
      </label>
      <div className='flex p-2 bg-slate-100 rounded-lg border border-slate-200'>
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className='w-full outline-none'
        />
        <div className='cursor-pointer' onClick={onToggleShowPassword}>
          {showPassword ? <EyeOff /> : <Eye />}
        </div>
      </div>
    </div>
  );
};
