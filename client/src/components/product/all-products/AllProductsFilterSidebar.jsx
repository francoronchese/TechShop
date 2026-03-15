import { Filter, ChevronDown, ChevronRight, X } from "lucide-react";

// Sort options available to the user
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "discount", label: "Discount: High to Low" },
];

export const AllProductsFilterSidebar = ({
  priceMin,
  priceMax,
  sliderRange,
  setSliderRange,
  allCategories,
  selectedCategoryId,
  selectedSubCategoryId,
  expandedCategoryId,
  sortBy,
  hasActiveFilters,
  clearFilters,
  getSubsByCategoryId,
  handleCategoryClick,
  updateParam,
  commitPriceRange,
}) => (
  <div className="p-5 border border-slate-300 rounded-xl bg-white shadow-sm">
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
    <div className="mb-5 pb-5 border-b border-slate-300">
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

    {/* Categories Filter with collapsible subcategories */}
    <div className="mb-5 pb-5 border-b border-slate-300">
      <h3 className="mb-3 text-sm font-bold text-gray-800">Categories</h3>
      <div className="flex flex-col gap-1">
        {allCategories.map((cat) => {
          const isExpanded = expandedCategoryId === cat._id;
          const isSelected = selectedCategoryId === cat._id;
          const relevantSubs = getSubsByCategoryId(cat._id);
          return (
            <div key={cat._id}>
              <button
                onClick={() => handleCategoryClick(cat._id)}
                className={`w-full flex items-center justify-between text-left text-sm py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-orange-500 text-white font-medium"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{cat.name}</span>
                {relevantSubs.length > 0 &&
                  (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
              </button>
              {/* Collapsible subcategory list */}
              {isExpanded && relevantSubs.length > 0 && (
                <div className="ml-3 mt-1 mb-1 border-l-2 border-slate-200 pl-3 flex flex-col gap-0.5">
                  {relevantSubs.map((sub) => (
                    <button
                      key={sub._id}
                      onClick={() =>
                        updateParam(
                          "subCategoryId",
                          selectedSubCategoryId === sub._id ? null : sub._id,
                        )
                      }
                      className={`text-left text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                        selectedSubCategoryId === sub._id
                          ? "text-orange-500 font-semibold bg-orange-100"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>

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