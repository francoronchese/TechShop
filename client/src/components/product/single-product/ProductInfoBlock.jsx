import { Link } from "react-router-dom";

export const ProductInfoBlock = ({ product }) => (
  <div className="p-6 bg-white border border-slate-200 rounded-xl">
    <h1 className="text-2xl font-bold text-slate-900 mb-3">{product.name}</h1>
    <div className="flex flex-wrap gap-1.5">
      {product.categories?.map((cat) => (
        <span
          key={cat._id}
          className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full"
        >
          {cat.name}
        </span>
      ))}
      {product.sub_categories?.map((sub) => (
        <span
          key={sub._id}
          className="text-xs px-2.5 py-1 bg-green-100 text-green-800 rounded-full"
        >
          {sub.name}
        </span>
      ))}
    </div>
  </div>
);