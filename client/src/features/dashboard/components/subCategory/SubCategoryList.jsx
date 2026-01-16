import React from "react";
import { Pencil, Trash2 } from "lucide-react";

// Renders flat cards. Accesses populated category objects to display the actual names in the chips.
const SubCategoryList = ({ items, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm hover:border-orange-200 transition-colors"
        >
          {/* Info Section: Name and Dynamic Chips */}
          <div className="flex flex-col gap-2">
            <span className="text-gray-700 font-bold">{item.name}</span>

            <div className="flex flex-wrap gap-1.5">
              {item.categories.map((category) => (
                <span
                  key={category._id}
                  className="px-2.5 py-0.5 text-slate-600 text-[10px] font-bold uppercase tracking-wider bg-white rounded-md border border-slate-200 shadow-sm"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(item._id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      {/* Empty List */}
      {items.length === 0 && (
        <div className="col-span-full p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <p className="text-sm text-gray-500">No sub-categories created yet</p>
        </div>
      )}
    </div>
  );
};

export default SubCategoryList;
