import { useDispatch, useSelector } from "react-redux";
import { setCart, clearCartState } from "@store/slices/cartSlice";
import {
  useAddToCartMutation,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "@store/api/apiSlice";

const useCartActions = () => {
  const dispatch = useDispatch();

  // Get user state from Redux store
  const userState = useSelector((state) => state.user);
  const isLoggedIn = userState._id !== "";

  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);

  // RTK Query mutations for backend cart operations
  const [addToCartMutation] = useAddToCartMutation();
  const [updateQuantity] = useUpdateCartQuantityMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCartMutation] = useClearCartMutation();

  const handleAddToCart = async (product) => {
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

  const handleIncrement = async (product) => {
    if (isLoggedIn) {
      // Increment quantity in backend cart and update Redux
      await updateQuantity({
        productId: product._id,
        type: "increment",
      }).unwrap();
      dispatch(
        setCart(
          cartItems.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        ),
      );
    } else {
      // Update localStorage cart for non-authenticated users
      const updatedCart = cartItems.map((item) =>
        item._id === product._id && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      dispatch(setCart(updatedCart));
    }
  };

  const handleDecrement = async (product) => {
    if (isLoggedIn) {
      if (product.quantity === 1) {
        // Remove item from backend cart and update Redux
        await removeFromCart({ productId: product._id }).unwrap();
        dispatch(setCart(cartItems.filter((item) => item._id !== product._id)));
      } else {
        // Decrement quantity in backend cart and update Redux
        await updateQuantity({
          productId: product._id,
          type: "decrement",
        }).unwrap();
        dispatch(
          setCart(
            cartItems.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            ),
          ),
        );
      }
    } else {
      // Update localStorage cart for non-authenticated users
      if (product.quantity === 1) {
        const updatedCart = cartItems.filter(
          (item) => item._id !== product._id,
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        dispatch(setCart(updatedCart));
      } else {
        const updatedCart = cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        dispatch(setCart(updatedCart));
      }
    }
  };

  const handleRemove = async (product) => {
    if (isLoggedIn) {
      // Remove item from backend cart and update Redux
      await removeFromCart({ productId: product._id }).unwrap();
      dispatch(setCart(cartItems.filter((item) => item._id !== product._id)));
    } else {
      // Remove item from localStorage cart for non-authenticated users
      const updatedCart = cartItems.filter((item) => item._id !== product._id);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      dispatch(setCart(updatedCart));
    }
  };

  const handleClearCart = async () => {
    if (isLoggedIn) {
      // Clear backend cart and update Redux
      await clearCartMutation().unwrap();
      dispatch(clearCartState());
    } else {
      // Clear localStorage cart for non-authenticated users
      localStorage.removeItem("cartItems");
      dispatch(clearCartState());
    }
  };

  return {
    cartItems,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleClearCart,
  };
};

export default useCartActions;
