import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { ProductCard, PaginationControls } from "@components";

const ITEMS_PER_PAGE = 12;

export const FavoritesPage = () => {
  const [page, setPage] = useState(1);

  // Get favorites from Redux store
  const favorites = useSelector((state) => state.favorites.items);

  // Paginate favorites
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const paginatedFavorites = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return favorites.slice(start, start + ITEMS_PER_PAGE);
  }, [favorites, page]);

  return (
    <div className="p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-slate-800 text-lg font-bold">My Favorites</h2>
        <p className="text-sm text-slate-600">
          Products you have saved as favorites
        </p>
      </div>

      {/* Empty state */}
      {favorites.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <Heart className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-400 text-sm">No favorites yet</p>
        </div>
      ) : (
        <>
          {/* Product grid */}
          <div className="grid grid-cols-1 min-[485px]:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedFavorites.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls
            page={page}
            totalPages={totalPages}
            totalCount={favorites.length}
            onPrev={() => setPage((prev) => prev - 1)}
            onNext={() => setPage((prev) => prev + 1)}
          />
        </>
      )}
    </div>
  );
};
