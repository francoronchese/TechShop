import { ProductCard, PageLoader } from "@components";

export const ProductGrid = ({ products, isLoading, isFetching, isError, totalCount, children }) => {
  if (isLoading || isFetching) {
    return (
      <div className="py-20">
        <PageLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500 font-medium">
        Error loading data. Please check your connection.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        No products found matching your filters.
      </div>
    );
  }

  return (
    <>
      {/* Products count */}
      {!isLoading && !isFetching && (
        <p className="text-sm text-slate-500 mb-4">
          {totalCount || 0} product{totalCount !== 1 ? "s" : ""} found
        </p>
      )}
      <div className="grid grid-cols-1 min-[485px]:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {/* Pagination injected from parent */}
      {children}
    </>
  );
};