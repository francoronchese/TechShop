import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Button, CategoryCard, ProductCard, PageLoader } from "@components";

// Import RTK Query hooks
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from "@store/api/apiSlice";

const HomePage = () => {
  const navigate = useNavigate();

  // RTK Query: Handles fetching and loading states for products and categories
  const { data: productsData, isLoading: loadingProducts } =
    useGetProductsQuery({ page: 1 });

  const { data: allCategories = [], isLoading: loadingCategories } =
    useGetCategoriesQuery();

  // Memoize the product list to prevent re-creating the array on every render
  const allProducts = useMemo(() => productsData?.data || [], [productsData]);

  // Get the first 12 products for the New Arrivals section
  const newArrivals = allProducts.slice(0, 12);

  // Product count per category returned by the backend (used in CategoryCard)
  const productCountByCategory = productsData?.categoryCount || {};

  return (
    <div>
      {/* Hero Banner */}
      <div className="-mx-6 -mt-6">
        <section className="bg-linear-to-r from-orange-500 to-orange-600 text-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to TechShop
            </h1>
            <p className="max-w-2xl mb-6 md:text-xl opacity-90">
              The ultimate collection of next-generation technology. Elevate
              your setup with top-tier equipment designed for peak performance
              and reliability.
            </p>
            <Button
              onClick={() => navigate("/products")}
              className="px-6 text-lg bg-white text-orange-600 hover:bg-gray-100 shadow-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.7)] duration-300 ease-in-out tracking-wide cursor-pointer"
            >
              Shop Now
            </Button>
          </div>
        </section>
      </div>

      {/* Categories Section */}
      <section className="py-12 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-8">
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
              <div className="col-span-full text-center text-slate-500">
                No categories available.
              </div>
            )}
          </div>
        )}
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
            New Arrivals
          </h2>
          <Button
            onClick={() => navigate("/products")}
            icon={ArrowRight}
            iconSize={20}
            className="bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 duration-300 ease-in-out"
          >
            View All
          </Button>
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
        <h2 className="mb-8 text-3xl md:text-4xl text-center font-extrabold text-slate-800">
          Why Choose TechShop?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
              <span className="text-3xl">🚚</span>
            </div>
            <h3 className="mb-2 text-slate-800 font-bold text-xl">Free Shipping</h3>
            <p className="text-slate-600">On orders over $200</p>
          </div>

          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="mb-2 text-slate-800 font-bold text-xl">Secure Payment</h3>
            <p className="text-slate-600">100% secure transactions</p>
          </div>

          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
              <span className="text-3xl">💯</span>
            </div>
            <h3 className="mb-2 text-slate-800 font-bold text-xl">Quality Guarantee</h3>
            <p className="text-slate-600">30-day money back</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
