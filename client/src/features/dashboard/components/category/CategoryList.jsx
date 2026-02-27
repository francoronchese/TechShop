import { Pencil, Trash2, Folder, Image as ImageIcon } from "lucide-react";
import { Button } from "@components";

const CategoryList = ({ items, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 min-[485px]:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {/* Map through all existing categories to display card view */}
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-slate-50 rounded-xl border border-slate-300 shadow-sm hover:border-orange-200 hover:shadow-md transition-all overflow-hidden"
        >
          {/* Wrapper for category image  */}
          <div className="relative w-full h-48">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-slate-400" />
              </div>
            )}
          </div>

          {/* Category details and action buttons */}
          <div className="p-4 bg-white border-t border-slate-300/80">
            <h3 className="text-gray-800 font-bold mb-3 truncate">
              {item.name}
            </h3>

            <div className="flex flex-col min-[540px]:flex-row gap-2">
              <Button
                onClick={() => onEdit(item)}
                className="flex-1 justify-center px-4 bg-blue-600 text-white text-sm hover:shadow-md"
                icon={Pencil}
                iconSize={14}
              >
                Edit
              </Button>
              <Button
                onClick={() => onDelete(item._id)}
                className="flex-1 justify-center px-4 bg-white text-red-600 border border-red-500 hover:bg-red-100 text-sm hover:shadow-md"
                icon={Trash2}
                iconSize={14}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Empty List */}
      {items.length === 0 && (
        <div className="col-span-full p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <Folder className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No categories created yet</p>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
