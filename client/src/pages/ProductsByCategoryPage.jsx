import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@store/api/apiSlice";
import {
  ProductGrid,
  PaginationControls,
  CategoryFilterSidebar,
  Button,
} from "@components";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";

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

  // Read filters from URL so they persist across page changes
  const selectedSubCategoryId = searchParams.get("subCategoryId") || null;
  const sortBy = searchParams.get("sortBy") || "default";
  const priceMinParam = searchParams.get("priceMin");
  const priceMaxParam = searchParams.get("priceMax");

  // Tracks slider position while dragging, sent to URL only on release
  const [sliderRange, setSliderRange] = useState([0, 5000]);

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
    priceMin: priceMinParam,
    priceMax: priceMaxParam,
  });
  const { data: allCategories = [] } = useGetCategoriesQuery();
  const { data: allSubCategories = [] } = useGetSubCategoriesQuery();

  // Add page=1 to URL on mount if missing, without losing other params
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("page", "1");
          return next;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);

  // Reset filters when category changes
  useEffect(() => {
    setSearchParams({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  // Scroll to top when filters or page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, categoryId, selectedSubCategoryId, priceMinParam, priceMaxParam]);

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

  // Sync sliderRange when backend returns a new price range (only if no price filter is active)
  useEffect(() => {
    if (priceMin && priceMax && !priceMinParam && !priceMaxParam) {
      setSliderRange([priceMin, priceMax]);
    }
  }, [priceMin, priceMax, priceMinParam, priceMaxParam]);

  // Check if any filter is actively applied
  const hasActiveFilters =
    selectedSubCategoryId ||
    sortBy !== "default" ||
    priceMinParam ||
    priceMaxParam;

  // Updates a single param while preserving the rest, resets to page 1
  const updateParam = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === null || value === undefined) {
          next.delete(key); // remove the param if value is null
        } else {
          next.set(key, value); // set or update the param
        }
        next.set("page", "1"); // always reset to page 1 on filter change
        return next;
      });
    },
    [setSearchParams],
  );

  // Reset all filters to their default values
  const clearFilters = useCallback(() => {
    setSliderRange([priceMin, priceMax]);
    setSearchParams({ page: 1 });
  }, [priceMin, priceMax, setSearchParams]);

  // Save final slider values to URL on mouse/touch release to trigger backend fetch
  const commitPriceRange = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("priceMin", String(sliderRange[0]));
      next.set("priceMax", String(sliderRange[1]));
      next.set("page", "1");
      return next;
    });
  }, [sliderRange, setSearchParams]);

  return (
    <section className="max-w-7xl mx-auto">
      {/* Page header with breadcrumb and category title */}
      <div className="mb-6 mt-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
          <Link to="/" className="hover:text-orange-500 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-orange-500 transition-colors">
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
          <div className="sticky top-24">
            <CategoryFilterSidebar
              priceMin={priceMin}
              priceMax={priceMax}
              sliderRange={sliderRange}
              setSliderRange={setSliderRange}
              categorySubCategories={categorySubCategories}
              selectedSubCategoryId={selectedSubCategoryId}
              sortBy={sortBy}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
              updateParam={updateParam}
              commitPriceRange={commitPriceRange}
            />
          </div>
        </aside>

        {/* Product grid area */}
        <main className="flex-1">
          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedSubCategoryId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                  {allSubCategories.find((sub) => sub._id === selectedSubCategoryId)?.name}
                  <button
                    onClick={() => updateParam("subCategoryId", null)}
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
                    onClick={() => updateParam("sortBy", null)}
                    className="cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {(priceMinParam || priceMaxParam) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  ${priceMinParam} - ${priceMaxParam}
                  <button
                    onClick={() => {
                      setSliderRange([priceMin ?? 0, priceMax ?? 5000]);
                      setSearchParams((prev) => {
                        const next = new URLSearchParams(prev);
                        next.delete("priceMin"); // remove price filters from URL
                        next.delete("priceMax");
                        next.set("page", "1");
                        return next;
                      });
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

          <ProductGrid
            products={allProducts}
            isLoading={loadingList}
            isFetching={isFetching}
            isError={errorList}
            totalCount={productsData?.totalCount}
          >
            <PaginationControls
              page={page}
              totalPages={productsData?.totalPages || 1}
              totalCount={productsData?.totalCount || 0}
              onPrev={() =>
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("page", String(page - 1)); // decrease page while keeping other params
                  return next;
                })
              }
              onNext={() =>
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("page", String(page + 1)); // increase page while keeping other params
                  return next;
                })
              }
            />
          </ProductGrid>
        </main>
      </div>
    </section>
  );
};

export default ProductsByCategoryPage;