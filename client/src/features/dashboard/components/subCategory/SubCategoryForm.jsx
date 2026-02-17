import React from "react";
import { Input } from "@components";

const SubCategoryForm = ({ formData, onChange, onToggle, allCategories }) => {
  return (
    <div className="grid grid-cols-1 items-start gap-4">
      <Input
        label="Sub-Category Name *"
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="Enter sub-category name"
        required
      />

      <div className="flex flex-col">
        <label className="block mb-2 font-semibold text-orange-500">
          Parent Categories *
        </label>

        {/* Scrollable container for multi-selection checkbox list */}
        <div className="grid gap-2 p-3 bg-slate-100 rounded-lg border border-slate-200">
          {allCategories.map((category) => (
            <label
              key={category._id}
              className="flex items-center gap-3 p-2 hover:bg-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                // .includes() checks if the category ID exists in the state array to toggle the visual checkmark
                checked={formData.categories.includes(category._id)}
                // Sends the ID to parent to add or remove it from the selection
                onChange={() => onToggle(category._id)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-gray-600">{category.name}</span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-gray-400 italic">
          You can select one or more parent categories for this sub-category.
        </p>
      </div>
    </div>
  );
};

export default SubCategoryForm;
