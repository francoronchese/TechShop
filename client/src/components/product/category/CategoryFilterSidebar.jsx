import { Filter } from "lucide-react";

// Sort options available to the user
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "discount", label: "Discount: High to Low" },
];

export const CategoryFilterSidebar = ({
  priceMin,
  priceMax,
  sliderRange,
  setSliderRange,
  categorySubCategories,
  selectedSubCategoryId,
  sortBy,
  hasActiveFilters,
  clearFilters,
  updateParam,
  commitPriceRange,
}) => (
  <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
    {/* Sidebar header with title and clear filters button */}
    <div className="flex items-center justify-between mb-5">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <Filter size={20} className="text-orange-500" />
        Filters
      </h2>
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-xs font-medium text-orange-600 hover:text-orange-700 cursor-pointer"
        >
          Clear All
        </button>
      )}
    </div>

    {/* Price Range Filter */}
    <div className="mb-5 pb-5 border-b border-slate-200">
      <h3 className="mb-3 text-sm font-bold text-gray-800">Price Range</h3>
      <div className="space-y-3">
        {/* Display current min and max values */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-orange-600">${sliderRange[0]}</span>
          <span className="text-sm font-semibold text-orange-600">${sliderRange[1]}</span>
        </div>
        {/* Min price slider */}
        <input
          type="range"
          min={priceMin}
          max={priceMax}
          value={sliderRange[0]}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (val <= sliderRange[1]) setSliderRange([val, sliderRange[1]]);
          }}
          onMouseUp={commitPriceRange}
          onTouchEnd={commitPriceRange}
          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
        />
        {/* Max price slider */}
        <input
          type="range"
          min={priceMin}
          max={priceMax}
          value={sliderRange[1]}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (val >= sliderRange[0]) setSliderRange([sliderRange[0], val]);
          }}
          onMouseUp={commitPriceRange}
          onTouchEnd={commitPriceRange}
          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>

    {/* Subcategories Filter */}
    {categorySubCategories.length > 0 && (
      <div className="mb-5 pb-5 border-b border-slate-200">
        <h3 className="mb-3 text-sm font-bold text-gray-800">Subcategories</h3>
        <div className="flex flex-col gap-1">
          {categorySubCategories.map((sub) => (
            <button
              key={sub._id}
              onClick={() =>
                updateParam(
                  "subCategoryId",
                  selectedSubCategoryId === sub._id ? null : sub._id,
                )
              }
              className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                selectedSubCategoryId === sub._id
                  ? "bg-orange-500 text-white font-medium"
                  : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Sort By Filter */}
    <div>
      <h3 className="mb-3 text-sm font-bold text-gray-800">Sort By</h3>
      <select
        value={sortBy}
        onChange={(e) => updateParam("sortBy", e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:border-orange-500 transition-all cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);