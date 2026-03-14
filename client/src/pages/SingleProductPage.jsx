import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useGetProductByIdQuery } from "@store/api/apiSlice";
import {
  PageLoader,
  ProductInfoBlock,
  ProductPurchaseBlock,
  ProductDescriptionBlock,
  ProductGalleryBlock,
} from "@components";

const SingleProductPage = () => {
  const { id } = useParams();

  // RTK Query: fetch single product by ID
  const { data: product, isLoading } = useGetProductByIdQuery(id);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <PageLoader />
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 mt-4 text-sm text-slate-500">
        <Link to="/" className="hover:text-orange-500 transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-orange-500 transition-colors">
          All Products
        </Link>
        {product.categories?.[0] && (
          <>
            <ChevronRight size={14} />
            <Link
              to={`/category/${product.categories[0]._id}`}
              className="hover:text-orange-500 transition-colors"
            >
              {product.categories[0].name}
            </Link>
          </>
        )}
      </div>

      {/* Mobile layout: title → images → cart → description */}
      <div className="flex flex-col gap-4 lg:hidden">
        <ProductInfoBlock product={product} />
        <ProductGalleryBlock
          images={product.image}
          productName={product.name}
          discount={product.discount}
        />
        <ProductPurchaseBlock product={product} />
        <ProductDescriptionBlock description={product.description} />
      </div>

      {/* Desktop layout: two columns — left: images + description, right: title + cart (sticky) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4">
        {/* Left - Image Gallery + Description */}
        <div className="lg:col-span-7">
          <ProductGalleryBlock
            images={product.image}
            productName={product.name}
            discount={product.discount}
          />
          <div className="mt-6">
            <ProductDescriptionBlock description={product.description} />
          </div>
        </div>

        {/* Right - title + cart, sticky on scroll */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">
            <ProductInfoBlock product={product} />
            <ProductPurchaseBlock product={product} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleProductPage;