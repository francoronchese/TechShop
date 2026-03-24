import { NavLink } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Users,
  Package,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useSelector } from "react-redux";

export const DashboardSidebar = () => {
  // Access user data from Redux store to determine permissions for Amin or User roles
  const user = useSelector((state) => state.user);

  // Navigation items available only to normal users
  const userNavItems = [
    { to: "/dashboard/profile", label: "My Account", icon: User },
    { to: "/dashboard/orders", label: "My Orders", icon: ShoppingBag },
    { to: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { to: "/dashboard/addresses", label: "Addresses", icon: MapPin },
  ];

  // Navigation items available only to administrators
  const adminNavItems = [
    { to: "/dashboard/profile", label: "My Account", icon: User },
    { to: "/dashboard/orders", label: "My Orders", icon: ShoppingBag },
    { to: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { to: "/dashboard/addresses", label: "Addresses", icon: MapPin },
    { to: "/dashboard/users", label: "Users", icon: Users },
    { to: "/dashboard/products", label: "Products", icon: Package },
    { to: "/dashboard/categories", label: "Categories", icon: Folder },
    {
      to: "/dashboard/sub-categories",
      label: "Sub Categories",
      icon: FolderOpen,
    },
  ];

  // Select the appropriate navigation set based on user role
  const navItems = user.role === "Admin" ? adminNavItems : userNavItems;

  return (
    <nav className="p-2 bg-white rounded-xl shadow-sm border border-slate-300">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive
                ? "bg-orange-500 text-white font-medium"
                : "text-slate-700 hover:bg-slate-200"
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
