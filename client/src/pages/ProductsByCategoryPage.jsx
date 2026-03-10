import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@store/api/apiSlice";
import { ProductCard, PageLoader, Button } from "@components";
import {
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

const ProductsByCategoryPage = () => {
  const { categoryId } = useParams();

  // URL Search Params for pagination persistence
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  // Active Filter State
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 5000]);

  // Sidebar visibility state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // RTK Query: fetch products filtered by this category
  const {
    data: productsData,
    isLoading: loadingList,
    isFetching,
    isError: errorList,
  } = useGetProductsQuery({
    page,
    categoryId,
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

  // Reset filters when category changes
  useEffect(() => {
    setSelectedSubCategoryId(null);
    setSortBy("default");
    setSearchParams({ page: 1 });
  }, [categoryId, setSearchParams]);

  // Find the current category object from the list
  const category = allCategories.find((cat) => cat._id === categoryId);

  // Get subcategories that belong to this specific category
  const categorySubCategories = useMemo(
    () =>
      allSubCategories.filter((sub) =>
        sub.categories?.some((cat) => String(cat._id) === String(categoryId)),
      ),
    [allSubCategories, categoryId],
  );

  // Memoized product list derived from RTK Query response
  const allProducts = useMemo(() => productsData?.data || [], [productsData]);

  // Store last valid price range from backend
  const priceMin = productsData?.priceRange?.minPrice;
  const priceMax = productsData?.priceRange?.maxPrice;

  // Sync price range slider when backend returns new price range
  useEffect(() => {
    setPriceRange([priceMin, priceMax]);
  }, [priceMin, priceMax]);

  // Apply client-side price filter on top of backend-filtered products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(
      (prod) => prod.price >= priceRange[0] && prod.price <= priceRange[1],
    );
  }, [allProducts, priceRange]);

  // Check if any filter is actively applied
  const hasActiveFilters =
    selectedSubCategoryId ||
    sortBy !== "default" ||
    priceRange[0] !== priceMin ||
    priceRange[1] !== priceMax;

  // Reset all filters to their default values
  const clearFilters = useCallback(() => {
    setSelectedSubCategoryId(null);
    setSortBy("default");
    setPriceRange([priceMin, priceMax]);
    setSearchParams({ page: 1 });
  }, [priceMin, priceMax, setSearchParams]);

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

        {/* Subcategories Filter */}
        {categorySubCategories.length > 0 && (
          <div className="mb-5 pb-5 border-b border-slate-200">
            <h3 className="mb-3 text-sm font-bold text-gray-800">
              Subcategories
            </h3>
            <div className="flex flex-col gap-1">
              {categorySubCategories.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => {
                    setSelectedSubCategoryId(
                      selectedSubCategoryId === sub._id ? null : sub._id,
                    );
                    // Reset to first page when subcategory changes
                    setSearchParams({ page: 1 });
                  }}
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
      categorySubCategories,
      selectedSubCategoryId,
      sortBy,
      hasActiveFilters,
      clearFilters,
      setSearchParams,
    ],
  );

  return (
    <section className="max-w-7xl mx-auto">
      {/* Page header with breadcrumb and category title */}
      <div className="mb-6 mt-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
          <Link to="/" className="hover:text-orange-500 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link
            to="/products"
            className="hover:text-orange-500 transition-colors"
          >
            All Products
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-700 font-medium">{category?.name}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          {category?.name}
        </h1>
      </div>

      {/* Mobile filter toggle button */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <p className="text-sm text-slate-500">
          {productsData?.totalCount || 0} product
          {productsData?.totalCount !== 1 ? "s" : ""} found
        </p>
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          icon={SlidersHorizontal}
          iconSize={18}
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          Filters
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - toggle on mobile, always visible on md+ */}
        <aside
          className={`md:w-64 shrink-0 ${isSidebarOpen ? "block" : "hidden"} md:block`}
        >
          <div className="sticky top-24">{sidebarContent}</div>
        </aside>

        {/* Product grid area */}
        <main className="flex-1">
          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedSubCategoryId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
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

          {/* Products count - desktop only */}
          {!loadingList && !isFetching && (
            <p className="hidden md:block text-sm text-slate-500 mb-4">
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

export default ProductsByCategoryPage;
