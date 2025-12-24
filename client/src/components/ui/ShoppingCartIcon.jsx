import { ShoppingCart } from 'lucide-react';

export const ShoppingCartIcon = () => {
  return (
    <div className='cursor-pointer relative mr-2'>
      <ShoppingCart size='30px' strokeWidth='1.75' />
      <div className='flex items-center justify-center absolute -top-2 -right-2 w-5 bg-orange-500 rounded-full'>
        <span className='text-sm text-white'>0</span>
      </div>
    </div>
  );
};
