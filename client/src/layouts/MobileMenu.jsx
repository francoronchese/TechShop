import { Link, useNavigate } from "react-router-dom";
import { SquareUserRound, LogOut } from "lucide-react";
import { Loader, Button } from "@components";

const MobileMenu = ({ isOpen, isLoggedIn, loading, onLogout, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className={`md:hidden transition-all duration-300 ease-in-out ${
      isOpen ? "max-h-40 opacity-100 mt-4 pt-4 border-t border-slate-200" : "max-h-0 opacity-0"
    }`}>
      <div className="flex flex-col gap-2">
        {isLoggedIn ? (
          // Display user profile and logout for authenticated users
          <>
            <Button
              onClick={() => {
                navigate("/dashboard");
                onClose();
              }}
              icon={SquareUserRound}
              iconSize={20}
              className="w-full justify-center bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
            >
              My Account
            </Button>
            <Button
              onClick={onLogout}
              disabled={loading}
              icon={loading ? null : LogOut}
              iconSize={20}
              className="w-full justify-center bg-red-500 text-white hover:bg-red-600 disabled:opacity-85"
            >
              {loading ? <Loader /> : "Logout"}
            </Button>
          </>
        ) : (
          // Display register and login for unauthenticated users
          <>
            <Link
              to="/login"
              onClick={onClose}
              className="px-3 py-2 text-center font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors tracking-wider"
            >
              Login
            </Link>
            <Link
              to="/sign-up"
              onClick={onClose}
              className="px-3 py-2 text-center font-semibold bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors tracking-wider"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;