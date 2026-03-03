import { Link } from "react-router-dom";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { Button, CategoryCard, ProductCard, PageLoader } from "@components";

// Import RTK Query hooks
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from "@store/api/apiSlice";

const HomePage = () => {
  // RTK Query: Handles fetching and loading states for products and categories
  const { data: productsData, isLoading: loadingProducts } =
    useGetProductsQuery({ page: 1 });

  const { data: allCategories = [], isLoading: loadingCategories } =
    useGetCategoriesQuery();

  // Memoize the product list to prevent re-creating the array on every render
  const allProducts = useMemo(() => productsData?.data || [], [productsData]);

  // Get the first 12 products for the New Arrivals section
  const newArrivals = allProducts.slice(0, 12);

  // Map category counts by iterating through all products
  const productCountByCategory = useMemo(() => {
    const counts = {};

    allProducts.forEach((product) => {
      product.categories?.forEach((category) => {
        const categoryId = category._id;
        if (categoryId) {
          counts[categoryId] = (counts[categoryId] || 0) + 1;
        }
      });
    });

    return counts;
  }, [allProducts]);

  return (
    <div>
      {/* Hero Banner */}
      <div className="-mx-6 -mt-6">
        <section className="bg-linear-to-r from-orange-500 to-orange-600 text-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to TechShop
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl opacity-90">
              The ultimate collection of next-generation technology. Elevate
              your setup with top-tier equipment designed for peak performance
              and reliability.
            </p>
            <Button className="bg-white text-orange-600 px-8 py-3 hover:bg-gray-100 shadow-sm transition-all">
              Shop Now
            </Button>
          </div>
        </section>
      </div>

      {/* Categories Section */}
      <section className="py-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Shop by Category
        </h2>

        {/* Display loader while categories are fetching or render the category grid */}
        {loadingCategories ? (
          <div className="flex justify-center py-10">
            <PageLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[485px]:grid-cols-2 md:grid-cols-3 gap-8">
            {allCategories.length > 0 ? (
              allCategories.map((category) => (
                <CategoryCard
                  key={category._id}
                  id={category._id}
                  name={category.name}
                  image={category.image}
                  productCount={productCountByCategory[category._id]}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No categories available.
              </div>
            )}
          </div>
        )}
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">New Arrivals</h2>
          <Link
            to="/products"
            className="flex items-center gap-1 text-orange-600 font-bold"
          >
            View All <ChevronRight size={20} />
          </Link>
        </div>

        {/* Display loader while products are fetching or render the product grid */}
        {loadingProducts ? (
          <div className="flex justify-center py-10">
            <PageLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[485px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto py-12">
        <h2 className="mb-8 text-3xl text-center font-bold text-gray-800">
          Why Choose TechShop?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
              <span className="text-3xl">🚚</span>
            </div>
            <h3 className="mb-2 font-bold text-xl">Free Shipping</h3>
            <p className="text-gray-600">On orders over $200</p>
          </div>

          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="mb-2 font-bold text-xl">Secure Payment</h3>
            <p className="text-gray-600">100% secure transactions</p>
          </div>

          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
              <span className="text-3xl">💯</span>
            </div>
            <h3 className="mb-2 font-bold text-xl">Quality Guarantee</h3>
            <p className="text-gray-600">30-day money back</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
