import { Upload, Image as ImageIcon } from "lucide-react";
import { Input } from "@components";

const CategoryForm = ({ formData, onChange, onPhotoUpload }) => {
  return (
    <div className="grid grid-cols-1 items-start gap-6">
      {/* Category name input field using global component */}
      <Input
        label="Category Name"
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="Enter category name"
        required
      />

      {/* Image upload and preview section */}
      <div className="flex flex-col">
        <label className="block mb-2 text-orange-500 font-semibold">
          Category Image
        </label>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Box for image preview */}
          <div className="shrink-0">
            <div className="w-32 h-32 items-center justify-center bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex overflow-hidden">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-12 h-12 text-slate-400" />
              )}
            </div>
          </div>

          {/* Action buttons for file selection */}
          <div className="flex flex-col justify-center gap-2 flex-1">
            <label
              htmlFor="category-image-upload"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg cursor-pointer transition-colors border border-slate-200 font-medium"
            >
              <div className="p-2 bg-orange-500 rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <span>{formData.image ? "Change Image" : "Select Image"}</span>
            </label>
            <input
              id="category-image-upload"
              type="file"
              accept="image/*"
              onChange={onPhotoUpload}
              className="hidden"
            />
            <p className="text-[11px] text-gray-400 italic">
              Formats: JPG, PNG, WEBP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
