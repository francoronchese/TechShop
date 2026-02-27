import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import imageToBase64 from "@utils/imageToBase64";
import uploadToCloudinary from "@helpers/cloudinaryUpload";

// Import RTK Query hooks
import {
  useGetProductsQuery,
  useSaveProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@store/api/apiSlice";

// Components
import ProductHeader from "../components/product/ProductHeader";
import ProductForm from "../components/product/ProductForm";
import ProductList from "../components/product/ProductList";
import { PageLoader, Button } from "@components";

export const ProductPage = () => {
  // URL Search Params for pagination persistence
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  // UI state to toggle between the list view and the creation/edit form
  const [isCreating, setIsCreating] = useState(false);
  // Search State
  const [searchProduct, setSearchProduct] = useState("");
  // Stores the ID of the product being edited
  const [editId, setEditId] = useState("");

  // RTK Query: Fetches products with pagination and search parameters
  const {
    data: productsData,
    isLoading: loadingList,
    isFetching,
    isError: errorList,
  } = useGetProductsQuery({ page, search: searchProduct });

  // RTK Query: Fetches parent categories and sub-categories for the selection form
  const { data: allCategories = [] } = useGetCategoriesQuery();
  const { data: allSubCategories = [] } = useGetSubCategoriesQuery();

  // RTK Query: Mutation hooks
  const [saveProduct, { isLoading: isSaving }] = useSaveProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Access to the products list
  const allProducts = productsData?.data || [];

  // Local state for form inputs before it's sent to the server
  const [formData, setFormData] = useState({
    name: "",
    image: [],
    categories: [],
    subCategories: [],
    stock: "",
    price: "",
    discount: "",
    description: "",
  });

  // Temporary base64 images for preview before Cloudinary upload
  const [productImages, setProductImages] = useState([]);

  // Sync URL on mount if 'page' param is missing
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Filter subcategories based on the categories selected in the form
  const filteredSubCategories = allSubCategories.filter((sub) => {
    if (!formData.categories || formData.categories.length === 0) return false;
    const selectedCategoryIds = new Set(formData.categories.map(String));
    return sub.categories.some((cat) =>
      selectedCategoryIds.has(String(cat._id)),
    );
  });

  // Handle input changes in product form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Blocks any input that is not a digit or a decimal point
  const handleNumericInput = (e) => {
    const allowedControlKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];
    if (allowedControlKeys.includes(e.key)) return;
    if (!/^[0-9.]$/.test(e.key)) e.preventDefault();
  };

  // Toggles (adds/removes) an ID in the specified formData array field
  const handleToggleArray = (id, field) => {
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      return { ...prev, [field]: updated };
    });
  };

  // Resets form data and other states to initial values
  const handleReset = () => {
    setFormData({
      name: "",
      image: [],
      categories: [],
      subCategories: [],
      stock: "",
      price: "",
      discount: "",
      description: "",
    });
    setProductImages([]);
    setIsCreating(false);
    setEditId("");
  };

  // Load existing product data into form and switch to form view
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      image: product.image,
      categories: product.categories?.map((cat) => cat._id),
      subCategories: product.sub_categories?.map((sub) => sub._id),
      stock: product.stock,
      price: product.price,
      discount: product.discount,
      description: product.description,
    });
    setProductImages(product.image);
    setEditId(product._id);
    setIsCreating(true);
  };

  // Handle multiple image selection and convert to base64 for preview
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const base64Images = await Promise.all(
        files.map((file) => imageToBase64(file)),
      );

      setProductImages((prev) => [...prev, ...base64Images]);

      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...base64Images],
      }));

      toast.success(`${files.length} image(s) added`);
    } catch (error) {
      toast.error("Failed to process images");
      console.error(error);
    }
  };

  // Remove image from preview and form data
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit product data to backend using RTK Query mutation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Determine which images need Cloudinary upload (new base64 vs existing URLs)
      const uploadedImages = await Promise.all(
        productImages.map((img) =>
          img.startsWith("data:")
            ? uploadToCloudinary(
                img,
                import.meta.env.VITE_CLOUDINARY_PRESET_PRODUCTS,
              )
            : img,
        ),
      );

      const payload = {
        ...formData,
        image: uploadedImages,
        ...(editId && { _id: editId }), // The _id is conditionally added only when editing
      };

      const response = await saveProduct(payload).unwrap();
      if (response.success) {
        toast.success(response.message);
        handleReset();
      }
    } catch (error) {
      toast.error(error.data?.message || "Error saving product");
    }
  };

  // Delete product using RTK Query mutation
  const handleDelete = async (id) => {
    try {
      const response = await deleteProduct({ _id: id }).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.data?.message || "Error deleting product");
    }
  };

  return (
    <div className="p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Product Management header with action buttons */}
      <ProductHeader
        isCreating={isCreating}
        onCreate={() => setIsCreating(true)}
        onCancel={handleReset}
        onSave={handleSubmit}
        loading={isSaving}
      />

      {/* Conditional view: Product creation form or List grid */}
      {isCreating ? (
        <ProductForm
          formData={formData}
          onChange={handleChange}
          onNumericInput={handleNumericInput}
          onPhotoUpload={handlePhotoUpload}
          onRemoveImage={handleRemoveImage}
          onToggleCategory={(id) => handleToggleArray(id, "categories")}
          onToggleSub={(id) => handleToggleArray(id, "subCategories")}
          allCategories={allCategories}
          allSubCategories={filteredSubCategories}
        />
      ) : (
        <>
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search product by name..."
              value={searchProduct}
              onChange={(e) => {
                setSearchProduct(e.target.value);
                setSearchParams({ page: 1 }); // Reset to first page on search
              }}
              className="w-full max-w-sm p-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-orange-500 transition-all shadow-sm"
            />
          </div>

          {/* Search Results Logic */}
          {loadingList || isFetching ? (
            <div className="py-20">
              <PageLoader />
            </div>
          ) : errorList ? (
            <div className="py-20 text-center text-red-500">
              Error loading data. Please check your connection.
            </div>
          ) : allProducts.length > 0 ? (
            <>
              <ProductList
                items={allProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {/* Pagination UI */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-300">
                <Button
                  onClick={() => setSearchParams({ page: page - 1 })}
                  disabled={page <= 1}
                  className="bg-white border border-slate-400 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-400 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </Button>

                <span className="text-sm font-medium text-slate-500">
                  <span className="hidden sm:inline">
                    Page {page} of {productsData?.totalPages || 1} (Total:{" "}
                    {productsData?.totalCount || 0})
                  </span>
                  <span className="sm:hidden">
                    {page} / {productsData?.totalPages || 1}
                  </span>
                </span>

                <Button
                  onClick={() => setSearchParams({ page: page + 1 })}
                  disabled={page >= (productsData?.totalPages || 1)}
                  className="bg-white border border-slate-400 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-400 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              No products found matching your search.
            </div>
          )}
        </>
      )}
    </div>
  );
};
