import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Logo from './Logo';
import { Search } from 'lucide-react';
import { SquareUserRound } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import SummaryApi, { baseURL } from '../config/summaryApi';
import { endUserSession } from '../store/slices/userSlice';

const Header = () => {
  const navigate = useNavigate();
  // Get user state from Redux store
  const userState = useSelector((state) => state.user);
  // Send actions to update Redux store
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await fetch(baseURL + SummaryApi.logout.url, {
        method: SummaryApi.logout.method,
        credentials: 'include',
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        // Clear user from Redux store
        dispatch(endUserSession());
        // Redirect to login page
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Connection error. Please try again later.');
    }
  };

  // Check if user is authenticated
  const isLoggedIn = userState._id !== '';

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

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className='hidden md:block px-3 py-1 bg-red-600 text-white rounded-sm hover:bg-red-500 hover:scale-105 transition-all duration-300 ease-in-out tracking-wider cursor-pointer'
          >
            Logout
          </button>
        ) : (
          <Link
            to='/login'
            className='hidden md:block px-3 py-1 bg-orange-600 text-white rounded-sm hover:bg-orange-500 hover:scale-105 transition-all duration-300 ease-in-out tracking-wider'
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
