import {
  Pencil,
  Trash2,
  Package,
  Image as ImageIcon,
  ShoppingBag,
} from "lucide-react";
import {Button} from '@components'

const ProductList = ({ items, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 min-[485px]:grid-cols-2 md:grid-cols-3 gap-4">
      {/* Map through all existing products to display card view */}
      {items.map((item) => (
        <div
          key={item._id}
          className="w-full bg-white border border-slate-300 hover:shadow-lg rounded-2xl overflow-hidden"
        >
          {/* Product image */}
          <div className="h-52 bg-gray-200 relative">
            {item.image?.[0] ? (
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-full h-full object-fill"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="text-gray-400" />
              </div>
            )}
            {/* Discount badge */}
            {item.discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                {item.discount}% OFF
              </span>
            )}
          </div>

          {/* Product details and action buttons */}
          <div className="p-4 border-t border-slate-300/80">
            <h3 className="font-bold text-gray-800 line-clamp-1">
              {item.name}
            </h3>

            {/* Category and sub-category tags */}
            <div className="mt-2 flex flex-wrap gap-1">
              {item.categories?.map((cat) => (
                <span
                  key={cat._id}
                  className="px-2 py-1 text-[10px] bg-blue-100 text-blue-800 rounded-full"
                >
                  {cat.name}
                </span>
              ))}
              {item.sub_categories?.map((sub) => (
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
                  ${item.price}
                </p>
                {item.discount > 0 && (
                  <span className="text-xs text-slate-400 line-through">
                    ${(item.price / (1 - item.discount / 100)).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs font-bold">
                <Package size={14} /> {item.stock || 0}
              </div>
            </div>

            {/* Edit and Delete buttons */}
            <div className="flex flex-col min-[540px]:flex-row gap-2 mt-4">
              <Button
                onClick={() => onEdit(item)}
                className="flex-1 justify-center bg-blue-600 text-white text-sm"
                icon={Pencil}
                iconSize={14}
              >
                Edit
              </Button>
              <Button
                onClick={() => onDelete(item._id)}
                className="flex-1 justify-center bg-white text-red-600 border border-red-500 hover:bg-red-100 text-sm"
                icon={Trash2}
                iconSize={14}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="col-span-full p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No products created yet</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
