import { ShoppingCart, Package, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  incrementQuantity,
  decrementQuantity,
} from "../../store/slices/cartSlice";
import { Button } from "./Button";

export const ProductCard = ({ product }) => {
  // Get data from Redux store
  const navigate = useNavigate();
  // Send actions to update Redux store
  const dispatch = useDispatch();

  // Get quantity from the global cart items array
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item._id === product._id),
  );
  const quantity = cartItem?.quantity || 0;

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Dispatch the full product object to the cart array
    dispatch(addToCart(product));
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    dispatch(incrementQuantity(product._id));
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    dispatch(decrementQuantity(product._id));
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
              className="w-full flex justify-center gap-2 bg-orange-500 text-white  hover:bg-orange-600"
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

export default ProductCard;
