import { Upload, X } from "lucide-react";
import { Input } from "@components";

const ProductForm = ({
  formData,
  onChange,
  onNumericInput,
  onPhotoUpload,
  onRemoveImage,
  onToggleCategory,
  onToggleSub,
  allCategories,
  allSubCategories,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Information inputs column */}
      <div className="space-y-5">
        <Input
          label="Product Name *"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Enter product name"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price ($) *"
            name="price"
            type="number"
            value={formData.price}
            onChange={onChange}
            onKeyDown={onNumericInput}
            placeholder="0.00"
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={onChange}
            onKeyDown={onNumericInput}
            placeholder="0"
          />
        </div>

        <Input
          label="Discount (%)"
          name="discount"
          type="number"
          value={formData.discount}
          onChange={onChange}
          onKeyDown={onNumericInput}
          placeholder="0"
        />

        <div className="grid gap-1.5">
          <label className="font-semibold text-orange-500">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows="4"
            className="p-3 border border-slate-200 rounded-lg text-sm resize-none focus:border-orange-500 outline-none transition-all"
            placeholder="Product details..."
          />
        </div>
      </div>

      {/* Media and selection column */}
      <div className="space-y-6">
        {/* Images selection area */}
        <div className="grid gap-1.5">
          <label className="font-semibold text-orange-500">Images *</label>

          <div className="grid grid-cols-3 gap-3">
            {formData.image.map((url, i) => (
              <div
                key={i}
                className="relative aspect-square border border-slate-200 rounded-xl overflow-hidden group shadow-sm"
              >
                <img
                  src={url}
                  alt={`Preview ${i}`}
                  className="w-full h-full object-cover"
                />
                <div className="flex items-center justify-center absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onRemoveImage(i)}
                    className="p-1.5 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}

            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-all group">
              <Upload
                className="text-slate-400 group-hover:text-orange-500 transition-colors"
                size={20}
              />
              <span className="mt-1 px-1 text-center text-[10px] font-medium text-slate-500 group-hover:text-orange-600">
                Add Photo
              </span>
              <input
                type="file"
                multiple
                onChange={onPhotoUpload}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* Cross-reference list selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="grid gap-1.5">
            <label className="font-semibold text-orange-500">
              Categories *
            </label>
            <div className="h-44 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              {allCategories.map((cat) => (
                <label
                  key={cat._id}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    formData.categories.includes(cat._id)
                      ? "bg-orange-100 text-orange-700"
                      : "hover:bg-white text-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(cat._id)}
                    onChange={() => onToggleCategory(cat._id)}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-xs font-medium">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-1.5">
            <label className="font-semibold text-orange-500">
              Sub-Categories *
            </label>
            <div className="h-44 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              {allSubCategories.length > 0 ? (
                allSubCategories.map((sub) => (
                  <label
                    key={sub._id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      formData.subCategories.includes(sub._id)
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-white text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.subCategories.includes(sub._id)}
                      onChange={() => onToggleSub(sub._id)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-xs font-medium">{sub.name}</span>
                  </label>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 text-center p-4 italic">
                  Select a category first
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
