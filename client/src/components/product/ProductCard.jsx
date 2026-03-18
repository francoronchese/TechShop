import { ShoppingCart, Package, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@store/slices/cartSlice";
import {
  useAddToCartMutation,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
} from "@store/api/apiSlice";
import { Button } from "../ui/Button";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  // Send actions to update Redux store
  const dispatch = useDispatch();

  // Get user state from Redux store
  const userState = useSelector((state) => state.user);
  const isLoggedIn = userState._id !== "";

  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);

  // Get quantity from the global cart items array
  const cartItem = cartItems.find((item) => item._id === product._id);
  const quantity = cartItem?.quantity || 0;

  // RTK Query mutations for backend cart operations
  const [addToCartMutation] = useAddToCartMutation();
  const [updateQuantity] = useUpdateCartQuantityMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (isLoggedIn) {
      // Add product to backend cart and update Redux
      await addToCartMutation({ productId: product._id }).unwrap();
      dispatch(setCart([...cartItems, { ...product, quantity: 1 }]));
    } else {
      // Save to localStorage cart for non-authenticated users
      const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const exists = currentCart.find((item) => item._id === product._id);
      if (!exists) {
        const updatedCart = [...currentCart, { ...product, quantity: 1 }];
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        dispatch(setCart(updatedCart));
      }
    }
  };

  const handleIncrement = async (e) => {
    e.stopPropagation();

    if (isLoggedIn) {
      // Increment quantity in backend cart and update Redux
      await updateQuantity({ productId: product._id, type: "increment" }).unwrap();
      dispatch(setCart(cartItems.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      )));
    } else {
      // Update localStorage cart for non-authenticated users
      const updatedCart = cartItems.map((item) =>
        item._id === product._id && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      dispatch(setCart(updatedCart));
    }
  };

  const handleDecrement = async (e) => {
    e.stopPropagation();

    if (isLoggedIn) {
      if (quantity === 1) {
        // Remove item from backend cart and update Redux
        await removeFromCart({ productId: product._id }).unwrap();
        dispatch(setCart(cartItems.filter((item) => item._id !== product._id)));
      } else {
        // Decrement quantity in backend cart and update Redux
        await updateQuantity({ productId: product._id, type: "decrement" }).unwrap();
        dispatch(setCart(cartItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity - 1 } : item
        )));
      }
    } else {
      // Update localStorage cart for non-authenticated users
      if (quantity === 1) {
        const updatedCart = cartItems.filter((item) => item._id !== product._id);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        dispatch(setCart(updatedCart));
      } else {
        const updatedCart = cartItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity - 1 } : item
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        dispatch(setCart(updatedCart));
      }
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full bg-white border border-slate-300 hover:shadow-lg rounded-2xl overflow-hidden transition-shadow duration-300 cursor-pointer"
    >
      {/* Product Image */}
      <div className="h-52 bg-gray-200 relative">
        {product.image?.[0] && (
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full h-full object-fill"
          />
        )}

        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="p-4 border-t border-slate-300/80">
        <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>

        {/* Category and sub-category tags */}
        <div className="mt-2 flex flex-wrap gap-1">
          {product.categories?.map((cat) => (
            <span
              key={cat._id}
              className="px-2 py-1 text-[10px] bg-blue-100 text-blue-800 rounded-full"
            >
              {cat.name}
            </span>
          ))}
          {product.sub_categories?.map((sub) => (
            <span
              key={sub._id}
              className="px-2 py-1 text-[10px] bg-green-100 text-green-800 rounded-full"
            >
              {sub.name}
            </span>
          ))}
        </div>

        {/* Price and stock information */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold text-orange-600">
              ${product.price}
            </p>
            {product.discount > 0 && (
              <span className="text-xs text-slate-400 line-through">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs font-bold">
            <Package size={14} /> {product.stock || 0}
          </div>
        </div>

        {/* Cart Controls */}
        <div className="mt-4">
          {quantity === 0 ? (
            <Button
              onClick={handleAddToCart}
              icon={ShoppingCart}
              iconSize={14}
              className="w-full flex justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
            >
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleDecrement}
                className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-600 cursor-pointer"
              >
                <Minus size={18} />
              </button>

              <span className="flex-1 text-center font-bold text-lg text-slate-800">
                {quantity}
              </span>

              <button
                onClick={handleIncrement}
                disabled={quantity >= (product.stock || 0)}
                className="flex items-center justify-center w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};