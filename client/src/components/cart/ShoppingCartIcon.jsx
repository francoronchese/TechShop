import { useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";

export const ShoppingCartIcon = ({ onClick }) => {
  // Get cart item count from Redux
  const { items } = useSelector((state) => state.cart);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div onClick={onClick} className="relative cursor-pointer p-1">
      <ShoppingCart size="30px" />
      {totalItems > 0 && (
        <p className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
          {totalItems}
        </p>
      )}
    </div>
  );
};
