import { ShoppingBag } from 'lucide-react';

export default function Logo() {
  return (
    <div className='flex items-center gap-2'>
      <div className='relative'>
        <ShoppingBag className='h-8 w-8 text-orange-600' strokeWidth={2} />
        <div className='absolute -top-1 -right-1 h-3 w-3 bg-orange-600 rounded-full border-2 border-white' />
      </div>
      <span
        className='text-orange-600 text-2xl font-bold tracking-tight'
      >
        TechShop
      </span>
    </div>
  );
}