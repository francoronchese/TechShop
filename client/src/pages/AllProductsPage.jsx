import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@store/api/apiSlice";
import {
  ProductGrid,
  PaginationControls,
  AllProductsFilterSidebar,
} from "@components";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@components";

// Sort options available to the user
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "discount", label: "Discount: High to Low" },
];

const AllProductsPage = () => {
  // URL Search Params for pagination and filter persistence
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  // Read filters from URL so they persist across page changes
  const selectedCategoryId = searchParams.get("categoryId") || null;
  const selectedSubCategoryId = searchParams.get("subCategoryId") || null;
  const sortBy = searchParams.get("sortBy") || "default";
  const priceMinParam = searchParams.get("priceMin");
  const priceMaxParam = searchParams.get("priceMax");
  const search = searchParams.get("search") || "";

  // Tracks slider position while dragging, sent to URL only on release
  const [sliderRange, setSliderRange] = useState([0, 5000]);

  // Sidebar visibility state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Expanded category in the filter sidebar (local state - visual only)
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  // RTK Query: fetch products with backend filters and pagination
  const {
    data: productsData,
    isLoading: loadingList,
    isFetching,
    isError: errorList,
  } = useGetProductsQuery({
    page,
    search,
    categoryId: selectedCategoryId,
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

  // Scroll to top when filters or page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, selectedCategoryId, selectedSubCategoryId, priceMinParam, priceMaxParam]);

  // Sync expandedCategoryId with selectedCategoryId from URL on mount
  useEffect(() => {
    if (selectedCategoryId) {
      setExpandedCategoryId(selectedCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Get subcategories that belong to a specific category
  const getSubsByCategoryId = useCallback(
    (catId) =>
      allSubCategories.filter((sub) =>
        sub.categories?.some((cat) => String(cat._id) === String(catId)),
      ),
    [allSubCategories],
  );

  // Check if any filter is actively applied
  const hasActiveFilters =
    selectedCategoryId ||
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
    setExpandedCategoryId(null);
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

  // Handle category button click: expand/collapse and select/deselect
  const handleCategoryClick = useCallback(
    (catId) => {
      if (expandedCategoryId === catId) {
        // Collapse and deselect if already active
        setExpandedCategoryId(null);
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("categoryId"); // deselect category
          next.delete("subCategoryId"); // also clear subcategory
          next.set("page", "1");
          return next;
        });
      } else {
        setExpandedCategoryId(catId);
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set("categoryId", catId);
          next.delete("subCategoryId"); // clear subcategory when switching category
          next.set("page", "1");
          return next;
        });
      }
    },
    [expandedCategoryId, setSearchParams],
  );

  return (
    <section className="max-w-7xl mx-auto">
      {/* Page header with dynamic breadcrumb */}
      <div className="mb-8 mt-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
          <Link to="/" className="hover:text-orange-500 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span
            className={
              selectedCategoryId
                ? "hover:text-orange-500 transition-colors cursor-pointer"
                : "text-slate-700 font-medium"
            }
            onClick={() => selectedCategoryId && clearFilters()}
          >
            All Products
          </span>
          {selectedCategoryId && (
            <>
              <ChevronRight size={14} />
              <span
                className={
                  selectedSubCategoryId
                    ? "hover:text-orange-500 transition-colors cursor-pointer"
                    : "text-slate-700 font-medium"
                }
                onClick={() =>
                  selectedSubCategoryId && updateParam("subCategoryId", null)
                }
              >
                {allCategories.find((c) => c._id === selectedCategoryId)?.name}
              </span>
            </>
          )}
          {selectedSubCategoryId && (
            <>
              <ChevronRight size={14} />
              <span className="text-slate-700 font-medium">
                {allSubCategories.find((sub) => sub._id === selectedSubCategoryId)?.name}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            {selectedCategoryId
              ? allCategories.find((cat) => cat._id === selectedCategoryId)?.name
              : "Explore Collection"}
          </h1>
          <Button
            onClick={() => setIsSidebarOpen(true)}
            icon={SlidersHorizontal}
            iconSize={18}
            className="md:hidden bg-orange-500 text-white hover:bg-orange-600"
          >
            Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - toggle on mobile, always visible on md+ */}
        <aside
          className={`md:w-64 shrink-0 ${isSidebarOpen ? "block" : "hidden"} md:block`}
        >
          <div className="sticky top-24">
            <AllProductsFilterSidebar
              priceMin={priceMin}
              priceMax={priceMax}
              sliderRange={sliderRange}
              setSliderRange={setSliderRange}
              allCategories={allCategories}
              selectedCategoryId={selectedCategoryId}
              selectedSubCategoryId={selectedSubCategoryId}
              expandedCategoryId={expandedCategoryId}
              sortBy={sortBy}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
              getSubsByCategoryId={getSubsByCategoryId}
              handleCategoryClick={handleCategoryClick}
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
              {selectedCategoryId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                  {allCategories.find((cat) => cat._id === selectedCategoryId)?.name}
                  <button
                    onClick={() => {
                      setExpandedCategoryId(null);
                      setSearchParams((prev) => {
                        const next = new URLSearchParams(prev);
                        next.delete("categoryId"); // remove category filter
                        next.delete("subCategoryId"); // also remove subcategory
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
              {selectedSubCategoryId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
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

export default AllProductsPage;