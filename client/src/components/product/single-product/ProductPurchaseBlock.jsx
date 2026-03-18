import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Plus, Minus, Truck, Shield, ArrowLeftRight } from "lucide-react";
import { setCart } from "@store/slices/cartSlice";
import {
  useAddToCartMutation,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
} from "@store/api/apiSlice";
import { Button } from "@components";

export const ProductPurchaseBlock = ({ product }) => {
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

  // Calculate final price and original price before discount
  const finalPrice = product.price;
  const originalPrice =
    product.discount > 0
      ? product.price / (1 - product.discount / 100)
      : null;
  const savings = originalPrice ? originalPrice - finalPrice : 0;

  const handleAddToCart = async () => {
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

  const handleIncrement = async () => {
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

  const handleDecrement = async () => {
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
    <div className="flex flex-col gap-4 p-6 bg-white border border-slate-200 rounded-xl">
      {/* Price */}
      <div>
        {originalPrice && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-slate-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-red-500">
              -{product.discount}%
            </span>
          </div>
        )}
        <p className="text-3xl font-bold text-orange-600">
          ${finalPrice.toFixed(2)}
        </p>
        {savings > 0 && (
          <p className="text-xs text-green-600 font-medium mt-1">
            You save ${savings.toFixed(2)}
          </p>
        )}
      </div>

      {/* Stock status */}
      <div className="flex flex-col gap-1">
        {product.stock > 0 ? (
          <p className="text-sm font-semibold text-green-600">✓ In Stock</p>
        ) : (
          <p className="text-sm font-semibold text-red-500">Out of Stock</p>
        )}
        {/* Low stock warning */}
        {product.stock > 0 && product.stock < 20 && (
          <p className="text-xs text-red-500">
            Only {product.stock} left — order soon
          </p>
        )}
      </div>

      {/* Delivery info */}
      <div className="flex items-start gap-2">
        <Truck size={16} className="mt-0.5 shrink-0 text-slate-400" />
        <div>
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-teal-600">FREE delivery</span>{" "}
            on orders over $200
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Or fastest delivery Tomorrow
          </p>
        </div>
      </div>

      {/* Cart controls: Add to Cart button when quantity is 0, otherwise +/- controls */}
      {quantity === 0 ? (
        <Button
          onClick={handleAddToCart}
          icon={ShoppingCart}
          iconSize={14}
          className="w-full justify-center bg-orange-500 text-white hover:bg-orange-600"
        >
          Add to Cart
        </Button>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleDecrement}
            className="flex items-center justify-center w-10 h-10 bg-slate-300 hover:bg-slate-400 rounded-lg transition-colors text-slate-600 cursor-pointer"
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

      {/* Security badges */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Shield size={13} />
          <span>Secure payment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowLeftRight size={13} />
          <span>30-day returns</span>
        </div>
      </div>
    </div>
  );
};