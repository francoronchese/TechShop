import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useGetProductsQuery } from "@store/api/apiSlice";
import { Loader } from "@components";

export const SearchBar = () => {
  const navigate = useNavigate();
  // Search query state
  const [searchQuery, setSearchQuery] = useState("");
  // Controls dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);
  // Ref to detect clicks outside the search bar to close the dropdown
  const searchRef = useRef(null);

  // RTK Query: fetch products with search query, skip if empty
  const { data: searchData, isFetching: isSearching } = useGetProductsQuery(
    { search: searchQuery.trim(), limit: 4 },
    { skip: !searchQuery.trim() },
  );

  // Derive search results from RTK Query response
  const searchResults = useMemo(() => searchData?.data || [], [searchData]);

  // Close dropdown when clicking outside the search bar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show dropdown when query has value and results are ready
  useEffect(() => {
    if (searchQuery.trim() && !isSearching) {
      setShowDropdown(true);
    } else if (!searchQuery.trim()) {
      setShowDropdown(false);
    }
  }, [searchQuery, isSearching, searchResults]);

  // Handle input changes
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Navigate to product page and reset search state
  const handleSelectProduct = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Navigate to all products page with search query and reset search state
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery.trim()}&page=1`);
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  return (
    <div ref={searchRef} className="relative flex w-full">
      <input
        type="text"
        placeholder="Search product here..."
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Navigate to all products page with search query on Enter key
            handleSearch();
          }
        }}
        className="w-full pl-2 border border-gray-300 outline-none rounded-l-full"
      />
      {/* Navigate to all products page with search query on button click */}
      <div
        onClick={handleSearch}
        className="flex items-center justify-center w-[50px] h-8 bg-orange-500 text-white rounded-r-full cursor-pointer"
      >
        {isSearching ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <Search />
        )}
      </div>

      {/* Search results dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div
                key={product._id}
                onClick={() => handleSelectProduct(product._id)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
              >
                {/* Product thumbnail */}
                <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-gray-100">
                  {product.image?.[0] && (
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-full h-full object-fill"
                    />
                  )}
                </div>
                {/* Product name */}
                <span className="text-sm text-slate-700 font-medium line-clamp-1">
                  {product.name}
                </span>
              </div>
            ))
          ) : (
            // No results message
            <div className="px-4 py-3 text-sm text-slate-400 text-center">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
