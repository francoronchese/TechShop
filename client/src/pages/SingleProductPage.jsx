import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Shield,
  ArrowLeftRight,
  ChevronRight,
  X,
} from "lucide-react";
import { useGetProductByIdQuery } from "@store/api/apiSlice";
import {
  addToCart,
  incrementQuantity,
  decrementQuantity,
} from "@store/slices/cartSlice";
import { Button, PageLoader } from "@components";

// Max thumbnails shown before the +N button
const MAX_THUMBNAILS = 6;
// Thumbnails height: 6  * 64px + 5 gaps * 8px = 424px
const GALLERY_HEIGHT = "h-[424px]";

const SingleProductPage = () => {
  const { id } = useParams();
  // Send actions to update Redux store
  const dispatch = useDispatch();

  // Index of the currently selected image in the main gallery
  const [selectedImage, setSelectedImage] = useState(0);
  // Controls visibility of the fullscreen image modal
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  // Index of the image shown inside the modal
  const [modalImage, setModalImage] = useState(0);

  // RTK Query: fetch single product by ID
  const { data: product, isLoading } = useGetProductByIdQuery(id);

  // Get quantity from the global cart items array
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item._id === product?._id),
  );
  const quantity = cartItem?.quantity || 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <PageLoader />
      </div>
    );
  }

  const images = product.image;
  // Show only the first MAX_THUMBNAILS thumbnails in the gallery
  const visibleThumbnails = images.slice(0, MAX_THUMBNAILS);
  // Number of images hidden behind the +N overlay on the last thumbnail
  const hiddenCount = images.length - MAX_THUMBNAILS;

  // Calculate final price and original price before discount
  const finalPrice = product.price;
  const originalPrice =
    product.discount > 0
      ? product.price / (1 - product.discount / 100)
      : null;
  const savings = originalPrice ? originalPrice - finalPrice : 0;

  // Dispatch the full product object to the cart array
  const handleAddToCart = () => dispatch(addToCart(product));

  const handleIncrement = () => dispatch(incrementQuantity(product._id));

  const handleDecrement = () => dispatch(decrementQuantity(product._id));

  // Open gallery modal starting at the given image index
  const openGallery = (index) => {
    setModalImage(index);
    setIsGalleryOpen(true);
  };

  // Title + tags block
  const TitleBlock = () => (
    <div className="p-6 bg-white border border-slate-200 rounded-xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-3">{product.name}</h1>
      <div className="flex flex-wrap gap-1.5">
        {product.categories?.map((cat) => (
          <span
            key={cat._id}
            className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full"
          >
            {cat.name}
          </span>
        ))}
        {product.sub_categories?.map((sub) => (
          <span
            key={sub._id}
            className="text-xs px-2.5 py-1 bg-green-100 text-green-800 rounded-full"
          >
            {sub.name}
          </span>
        ))}
      </div>
    </div>
  );

  // Price + stock + delivery + cart + badges block
  const CartBlock = () => (
    <div className="flex flex-col gap-4 p-6 bg-white border border-slate-200 rounded-xl">
      {/* Price */}
      <div>
        {originalPrice && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-slate-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-red-500">
              -{product.discount}%
            </span>
          </div>
        )}
        <p className="text-3xl font-bold text-orange-600">
          ${finalPrice.toFixed(2)}
        </p>
        {savings > 0 && (
          <p className="text-xs text-green-600 font-medium mt-1">
            You save ${savings.toFixed(2)}
          </p>
        )}
      </div>

      {/* Stock status */}
      <div className="flex flex-col gap-1">
        {product.stock > 0 ? (
          <p className="text-sm font-semibold text-green-600">✓ In Stock</p>
        ) : (
          <p className="text-sm font-semibold text-red-500">Out of Stock</p>
        )}
        {/* Low stock warning */}
        {product.stock > 0 && product.stock < 20 && (
          <p className="text-xs text-red-500">
            Only {product.stock} left — order soon
          </p>
        )}
      </div>

      {/* Delivery info */}
      <div className="flex items-start gap-2">
        <Truck size={16} className="mt-0.5 shrink-0 text-slate-400" />
        <div>
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-teal-600">FREE delivery</span>{" "}
            on orders over $200
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Or fastest delivery Tomorrow
          </p>
        </div>
      </div>

      {/* Cart controls: Add to Cart button when quantity is 0, otherwise +/- controls */}
      {quantity === 0 ? (
        <Button
          onClick={handleAddToCart}
          icon={ShoppingCart}
          iconSize={14}
          className="w-full justify-center bg-orange-500 text-white hover:bg-orange-600"
        >
          Add to Cart
        </Button>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleDecrement}
            className="flex items-center justify-center w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors text-slate-600 cursor-pointer"
          >
            <Minus size={18} />
          </button>
          <span className="flex-1 text-center font-bold text-lg text-slate-800">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= (product.stock || 0)}
            className="flex items-center justify-center w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
          </button>
        </div>
      )}

      {/* Security badges */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Shield size={13} />
          <span>Secure payment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowLeftRight size={13} />
          <span>30-day returns</span>
        </div>
      </div>
    </div>
  );

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
        <TitleBlock />

        {/* Mobile image gallery: main image on top, thumbnails scrollable below */}
        <div>
          <div
            className="relative mb-3 border border-slate-200 rounded-xl overflow-hidden bg-white cursor-pointer"
            onClick={() => openGallery(selectedImage)}
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-72 object-contain"
            />
            {/* Discount badge */}
            {product.discount > 0 && (
              <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Thumbnails - horizontal scrollable */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {visibleThumbnails.map((img, index) => {
              const isLast = index === MAX_THUMBNAILS - 1 && hiddenCount > 0;
              return (
                <button
                  key={index}
                  onClick={() =>
                    isLast ? openGallery(index) : setSelectedImage(index)
                  }
                  className={`relative w-16 h-16 shrink-0 border-2 rounded-lg overflow-hidden transition-colors cursor-pointer ${
                    selectedImage === index && !isLast
                      ? "border-orange-500"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {/* +N overlay on last visible thumbnail */}
                  {isLast && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        +{hiddenCount + 1}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <CartBlock />

        {/* Description - last in mobile */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl">
          <h2 className="mb-3 text-slate-900 text-lg font-bold">
            About this product
          </h2>
          {/* If description uses bullet points, split and render each as a list item */}
          {product.description.includes("•") ? (
            <ul className="space-y-2">
              {product.description
                .split("•")
                .filter((item) => item.trim() !== "")
                .map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="mt-0.5 shrink-0 text-orange-500">•</span>
                    <span>{item.trim()}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Desktop layout: two columns — left: images + description, right: title + cart (sticky) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4">
        {/* Left - Image Gallery + Description */}
        <div className="lg:col-span-7">
          {/* Desktop gallery: thumbnails vertical on the left, main image on the right */}
          <div className="flex gap-2">
            {/* Thumbnails - vertical */}
            <div className="flex flex-col gap-2 w-16 shrink-0">
              {visibleThumbnails.map((img, index) => {
                const isLast = index === MAX_THUMBNAILS - 1 && hiddenCount > 0;
                return (
                  <button
                    key={index}
                    onClick={() =>
                      isLast ? openGallery(index) : setSelectedImage(index)
                    }
                    className={`relative w-16 h-16 shrink-0 border-2 rounded-lg overflow-hidden transition-colors cursor-pointer ${
                      selectedImage === index && !isLast
                        ? "border-orange-500"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {/* +N overlay on last visible thumbnail */}
                    {isLast && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          +{hiddenCount + 1}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main image */}
            <div className="flex-1">
              <div
                className="border border-slate-200 rounded-xl overflow-hidden bg-white relative cursor-pointer"
                onClick={() => openGallery(selectedImage)}
              >
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className={`w-full ${GALLERY_HEIGHT} object-contain`}
                />
                {/* Discount badge */}
                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description - below the gallery on desktop */}
          <div className="mt-6 p-6 bg-white border border-slate-200 rounded-xl">
            <h2 className="mb-3 text-slate-900 text-lg font-bold">
              About this product
            </h2>
            {/* If description uses bullet points, split and render each as a list item */}
            {product.description.includes("•") ? (
              <ul className="space-y-2">
                {product.description
                  .split("•")
                  .filter((item) => item.trim() !== "")
                  .map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <span className="mt-0.5 shrink-0 text-orange-500">•</span>
                      <span>{item.trim()}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Right - title + cart, sticky on scroll */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">
            <TitleBlock />
            <CartBlock />
          </div>
        </div>
      </div>

      {/* Image Gallery Modal - fullscreen overlay with main image and scrollable thumbnails */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl">
            {/* Modal header: image counter + close button */}
            <div className="flex items-center justify-between p-4 shrink-0 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">
                {modalImage + 1} / {images.length}
              </h3>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body: main image on top, thumbnails scrollable below */}
            <div className="flex flex-col flex-1 gap-4 p-4 overflow-hidden">
              {/* Main image */}
              <div className="flex items-center justify-center flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <img
                  src={images[modalImage]}
                  alt={product.name}
                  className="max-w-full max-h-[45vh] object-contain"
                />
              </div>

              {/* Thumbnails - all images, horizontal scrollable */}
              <div className="flex gap-2 pb-1 shrink-0 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setModalImage(index)}
                    className={`w-16 h-16 shrink-0 border-2 rounded-lg overflow-hidden transition-colors cursor-pointer ${
                      modalImage === index
                        ? "border-orange-500"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SingleProductPage;