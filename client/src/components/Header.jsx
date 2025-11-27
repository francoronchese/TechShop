import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Search } from 'lucide-react';
import { SquareUserRound } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';

const Header = () => {
  return (
    <header className='flex items-center justify-between sticky top-0 z-40 p-6 bg-white shadow-md '>
      <Link to='/'>
        <Logo />
      </Link>

      <div className='hidden md:flex w-full max-w-md ml-3'>
        <input
          type='text'
          placeholder='Search product here...'
          className='w-full pl-2 border border-gray-300 outline-none rounded-l-full'
        />
        <div className='flex items-center justify-center w-[50px] h-8 bg-orange-600 text-white rounded-r-full cursor-pointer'>
          <Search />
        </div>
      </div>

      <div className='flex gap-4 items-center'>
        <div className='cursor-pointer relative'>
          <ShoppingCart size='30px' strokeWidth='1.75' />
          <div className='flex items-center justify-center absolute -top-2 -right-2 w-5 bg-orange-600 rounded-full'>
            <span className='text-sm text-white'>0</span>
          </div>
        </div>

        <SquareUserRound
          size='36px'
          strokeWidth='1.25'
          className='cursor-pointer'
        />

        <Link
          to='/login'
          className='hidden md:block px-3 py-1 bg-orange-600 text-white rounded-sm hover:bg-orange-500 hover:scale-105 transition-all duration-300 ease-in-out tracking-wider'
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
