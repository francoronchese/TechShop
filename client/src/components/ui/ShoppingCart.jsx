import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart as CartIcon, Trash2, Plus, Minus, X } from "lucide-react";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "@store/slices/cartSlice";

export const ShoppingCart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  // Access items from the global cart state
  const { items } = useSelector((state) => state.cart);

  // Calculate the total price of all items
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div
      className={`fixed inset-0 z-100 overflow-hidden transition-all duration-500 ${isOpen ? "visible" : "invisible pointer-events-none"}`}
    >
      {/* Backdrop overlay with blur effect */}
      <div
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div
          className={`w-screen max-w-md bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Header section */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CartIcon className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                My Cart
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Scrollable list of cart items */}
          <div className="flex-1  overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <CartIcon className="w-8 h-8 mb-4 text-slate-500" />

                <p className="text-slate-500 font-medium">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="mt-4 text-orange-600 font-bold hover:underline uppercase text-sm cursor-pointer"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="flex gap-4">
                  {/* Thumbnail container */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    {item.image?.[0] && (
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-full h-full object-fill"
                      />
                    )}
                  </div>

                  {/* Item info and controls */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="text-orange-600 font-bold text-sm mb-3">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-3">
                      {/* Quantity selector logic tied to cartSlice */}
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden h-8">
                        <button
                          onClick={() => dispatch(decrementQuantity(item._id))}
                          className="flex items-center justify-center w-8 h-full  text-slate-600
                         hover:text-white hover:bg-orange-500 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(incrementQuantity(item._id))}
                          className="flex items-center justify-center w-8 h-full  text-slate-600
                         hover:text-white hover:bg-orange-500 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary and Checkout section */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">
                  Estimated Total
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button className="w-full py-4 font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl  transition-all shadow-lg shadow-orange-200  uppercase tracking-wider">
                Proceed to Checkout
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
