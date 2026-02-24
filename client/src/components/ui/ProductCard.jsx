import { ShoppingCart, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Logic for cart will be implemented here later
    console.log("Added to cart:", product.name);
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

        {/* Add To Cart Button */}
        <div className="mt-4">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer hover:bg-orange-600"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
