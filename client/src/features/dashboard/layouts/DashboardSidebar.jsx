import { NavLink } from 'react-router-dom';
import { User, ShoppingBag, Heart, MapPin } from 'lucide-react';

export const DashboardSidebar = () => {
  const navItems = [
    { to: '/dashboard/profile', label: 'My Account', icon: User },
    { to: '/dashboard/orders', label: 'My Orders', icon: ShoppingBag },
    { to: '/dashboard/favorites', label: 'Favorites', icon: Heart },
    { to: '/dashboard/addresses', label: 'Addresses', icon: MapPin },
  ];

  return (
    <nav className='p-2 bg-white rounded-xl shadow-sm'>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive
                ? 'bg-orange-500 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
