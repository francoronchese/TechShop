import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@store/api/apiSlice";
import { ProductCard, PageLoader, Button } from "@components";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  X,
  SlidersHorizontal,
} from "lucide-react";

// Sort options available to the user
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "discount", label: "Discount: High to Low" },
];

const AllProductsPage = () => {
  // URL Search Params for pagination persistence
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  // Active Filter State
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 5000]);

  // Sidebar visibility state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Expanded category in the filter sidebar (stores category _id or null)
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  // RTK Query: fetch products with backend filters and pagination
  const {
    data: productsData,
    isLoading: loadingList, // Initial load
    isFetching, // Subsequent loads (pagination)
    isError: errorList,
  } = useGetProductsQuery({
    page,
    categoryId: selectedCategoryId,
    subCategoryId: selectedSubCategoryId,
    sortBy,
  });
  const { data: allCategories = [] } = useGetCategoriesQuery();
  const { data: allSubCategories = [] } = useGetSubCategoriesQuery();

  // Sync URL on mount if 'page' param is missing
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Memoized product list derived from RTK Query response
  const allProducts = useMemo(() => productsData?.data || [], [productsData]);

  // Store last valid price range from backend to avoid resetting while fetching
  const priceMin = productsData?.priceRange?.minPrice;
  const priceMax = productsData?.priceRange?.maxPrice;

  // Sync price range slider when backend returns new price range
  useEffect(() => {
    setPriceRange([priceMin, priceMax]);
  }, [priceMin, priceMax]);

  // Get subcategories that belong to a specific category
  const getSubsByCategoryId = useCallback(
    (catId) =>
      allSubCategories.filter((sub) =>
        sub.categories?.some((cat) => String(cat._id) === String(catId)),
      ),
    [allSubCategories],
  );

  // Apply client-side price filter on top of backend-filtered products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(
      (prod) => prod.price >= priceRange[0] && prod.price <= priceRange[1],
    );
  }, [allProducts, priceRange]);

  // Check if any filter is actively applied
  const hasActiveFilters =
    selectedCategoryId ||
    selectedSubCategoryId ||
    sortBy !== "default" ||
    priceRange[0] !== priceMin ||
    priceRange[1] !== priceMax;

  // Reset all filters to their default values and go back to first page
  const clearFilters = useCallback(() => {
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setSortBy("default");
    setPriceRange([priceMin, priceMax]);
    setExpandedCategoryId(null);
    setSearchParams({ page: 1 });
  }, [priceMin, priceMax, setSearchParams]);

  // Handle category button click: expand/collapse and select/deselect
  const handleCategoryClick = useCallback(
    (catId) => {
      if (expandedCategoryId === catId) {
        // Collapse and deselect if already active
        setExpandedCategoryId(null);
        setSelectedCategoryId(null);
        setSelectedSubCategoryId(null);
      } else {
        setExpandedCategoryId(catId);
        setSelectedCategoryId(catId);
        setSelectedSubCategoryId(null);
      }
      // Reset to first page when category changes
      setSearchParams({ page: 1 });
    },
    [expandedCategoryId, setSearchParams],
  );

  // Sidebar memoized as JSX to prevent re-creation on every render
  // Only re-renders when filter state or data actually changes
  const sidebarContent = useMemo(
    () => (
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
              <span className="text-sm font-semibold text-orange-600">
                ${priceRange[0]}
              </span>
              <span className="text-sm font-semibold text-orange-600">
                ${priceRange[1]}
              </span>
            </div>
            {/* Min price slider */}
            <input
              type="range"
              min={priceMin}
              max={priceMax}
              value={priceRange[0]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val <= priceRange[1]) setPriceRange([val, priceRange[1]]);
              }}
              className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            {/* Max price slider */}
            <input
              type="range"
              min={priceMin}
              max={priceMax}
              value={priceRange[1]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= priceRange[0]) setPriceRange([priceRange[0], val]);
              }}
              className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>

        {/* Categories Filter with collapsible subcategories */}
        <div className="mb-5 pb-5 border-b border-slate-200">
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
                      (isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      ))}
                  </button>

                  {/* Collapsible subcategory list */}
                  {isExpanded && relevantSubs.length > 0 && (
                    <div className="ml-3 mt-1 mb-1 border-l-2 border-slate-200 pl-3 flex flex-col gap-0.5">
                      {relevantSubs.map((sub) => (
                        <button
                          key={sub._id}
                          onClick={() => {
                            setSelectedSubCategoryId(
                              selectedSubCategoryId === sub._id
                                ? null
                                : sub._id,
                            );
                            // Reset to first page when subcategory changes
                            setSearchParams({ page: 1 });
                          }}
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
            onChange={(e) => {
              setSortBy(e.target.value);
              // Reset to first page when sort changes
              setSearchParams({ page: 1 });
            }}
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
    ),
    [
      priceMin,
      priceMax,
      priceRange,
      allCategories,
      selectedCategoryId,
      selectedSubCategoryId,
      expandedCategoryId,
      sortBy,
      hasActiveFilters,
      clearFilters,
      getSubsByCategoryId,
      handleCategoryClick,
      setSearchParams,
    ],
  );

  return (
    <section className="max-w-7xl mx-auto">
      {/* Page header with title and mobile filter toggle button */}
      <div className="flex items-center justify-between mb-8 mt-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          Explore Collection
        </h1>
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          icon={SlidersHorizontal}
          iconSize={18}
          className="md:hidden bg-orange-500 text-white hover:bg-orange-600"
        >
          Filters
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - toggle on mobile, always visible on md+ */}
        <aside className={`md:w-64 shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <div className="sticky top-24">{sidebarContent}</div>
        </aside>

        {/* Product grid area */}
        <main className="flex-1">
          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedCategoryId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                  {
                    allCategories.find((cat) => cat._id === selectedCategoryId)
                      ?.name
                  }
                  <button
                    onClick={() => {
                      setSelectedCategoryId(null);
                      setSelectedSubCategoryId(null);
                      setExpandedCategoryId(null);
                      setSearchParams({ page: 1 });
                    }}
                    className="cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedSubCategoryId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {
                    allSubCategories.find(
                      (sub) => sub._id === selectedSubCategoryId,
                    )?.name
                  }
                  <button
                    onClick={() => {
                      setSelectedSubCategoryId(null);
                      setSearchParams({ page: 1 });
                    }}
                    className="cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {sortBy !== "default" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                  {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label}
                  <button
                    onClick={() => {
                      setSortBy("default");
                      setSearchParams({ page: 1 });
                    }}
                    className="cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products count */}
          {!loadingList && !isFetching && (
            <p className="text-sm text-slate-500 mb-4">
              {productsData?.totalCount || 0} product
              {productsData?.totalCount !== 1 ? "s" : ""} found
            </p>
          )}

          {/* Products grid with loading, error and empty states */}
          {loadingList || isFetching ? (
            <div className="py-20">
              <PageLoader />
            </div>
          ) : errorList ? (
            <div className="py-20 text-center text-red-500 font-medium">
              Error loading data. Please check your connection.
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 min-[485px]:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination UI */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-300">
                <Button
                  onClick={() => setSearchParams({ page: page - 1 })}
                  disabled={page <= 1}
                  className="bg-white border border-slate-400 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-400 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </Button>
                <span className="text-sm font-medium text-slate-500">
                  <span className="hidden sm:inline">
                    Page {page} of {productsData?.totalPages || 1} (Total:{" "}
                    {productsData?.totalCount || 0})
                  </span>
                  <span className="sm:hidden">
                    {page} / {productsData?.totalPages || 1}
                  </span>
                </span>
                <Button
                  onClick={() => setSearchParams({ page: page + 1 })}
                  disabled={page >= (productsData?.totalPages || 1)}
                  className="bg-white border border-slate-400 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-400 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              No products found matching your filters.
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default AllProductsPage;
