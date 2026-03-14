import { useState } from "react";
import { X } from "lucide-react";

// Max thumbnails shown before the +N button
const MAX_THUMBNAILS = 6;
// Thumbnails height: 6 * 64px + 5 gaps * 8px = 424px
const GALLERY_HEIGHT = "h-[424px]";

export const ProductGalleryBlock = ({ images, productName, discount }) => {
  // Index of the currently selected image in the main gallery
  const [selectedImage, setSelectedImage] = useState(0);
  // Controls visibility of the fullscreen image modal
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  // Index of the image shown inside the modal
  const [modalImage, setModalImage] = useState(0);

  // Show only the first MAX_THUMBNAILS thumbnails in the gallery
  const visibleThumbnails = images.slice(0, MAX_THUMBNAILS);
  // Number of images hidden behind the +N overlay on the last thumbnail
  const hiddenCount = images.length - MAX_THUMBNAILS;

  // Open gallery modal starting at the given image index
  const openGallery = (index) => {
    setModalImage(index);
    setIsGalleryOpen(true);
  };

  return (
    <>
      {/* Mobile image gallery: main image on top, thumbnails scrollable below */}
      <div className="lg:hidden">
        <div
          className="relative mb-3 border border-slate-200 rounded-xl overflow-hidden bg-white cursor-pointer"
          onClick={() => openGallery(selectedImage)}
        >
          <img
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-72 object-contain"
          />
          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
              -{discount}%
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

      {/* Desktop gallery: thumbnails vertical on the left, main image on the right */}
      <div className="hidden lg:flex gap-2">
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
              alt={productName}
              className={`w-full ${GALLERY_HEIGHT} object-contain`}
            />
            {/* Discount badge */}
            {discount > 0 && (
              <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                -{discount}%
              </span>
            )}
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
                  alt={productName}
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
    </>
  );
};