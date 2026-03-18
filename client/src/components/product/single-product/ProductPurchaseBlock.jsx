import { ShoppingCart, Plus, Minus, Truck, Shield, ArrowLeftRight } from "lucide-react";
import useCartActions from "@hooks/useCartActions";
import { Button } from "@components";

export const ProductPurchaseBlock = ({ product }) => {
  // Get cart actions and items from custom hook
  const { cartItems, handleAddToCart, handleIncrement, handleDecrement } = useCartActions();

  // Get quantity from the global cart items array
  const cartItem = cartItems.find((item) => item._id === product._id);
  const quantity = cartItem?.quantity || 0;

  // Calculate final price and original price before discount
  const finalPrice = product.price;
  const originalPrice =
    product.discount > 0
      ? product.price / (1 - product.discount / 100)
      : null;
  const savings = originalPrice ? originalPrice - finalPrice : 0;

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
          onClick={() => handleAddToCart(product)}
          icon={ShoppingCart}
          iconSize={14}
          className="w-full justify-center bg-orange-500 text-white hover:bg-orange-600"
        >
          Add to Cart
        </Button>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => handleDecrement({ ...product, quantity })}
            className="flex items-center justify-center w-10 h-10 bg-slate-300 hover:bg-slate-400 rounded-lg transition-colors text-slate-600 cursor-pointer"
          >
            <Minus size={18} />
          </button>
          <span className="flex-1 text-center font-bold text-lg text-slate-800">
            {quantity}
          </span>
          <button
            onClick={() => handleIncrement(product)}
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