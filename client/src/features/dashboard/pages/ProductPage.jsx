import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import SummaryApi, { baseURL } from "@config/summaryApi";
import { setAllCategories } from "@store/slices/categorySlice";
import { setAllSubCategories } from "@store/slices/subCategorySlice";
import { setAllProducts } from "@store/slices/productSlice";
import imageToBase64 from "@utils/imageToBase64";
import uploadToCloudinary from "@helpers/cloudinaryUpload";
import ProductHeader from "../components/product/ProductHeader";
import ProductForm from "../components/product/ProductForm";
import ProductList from "../components/product/ProductList";
import { PageLoader } from "@components";

export const ProductPage = () => {
  // Get data from Redux store
  const { allProducts } = useSelector((state) => state.product);
  const { allCategories } = useSelector((state) => state.category);
  const { allSubCategories } = useSelector((state) => state.subCategory);

  // Send actions to update Redux store
  const dispatch = useDispatch();

  // URL Search Params for pagination persistence
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  // Pagination State
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Search State
  const [searchProduct, setSearchProduct] = useState("");

  // State to store the ID of the product being edited
  const [editId, setEditId] = useState("");
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

  // Fetch all products from backend and update Redux store
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}${SummaryApi.getAllProducts.url}?page=${page}&search=${searchProduct}`,
      );
      const data = await response.json();

      if (data.success) {
        // Set Redux store with all products data
        dispatch(setAllProducts(data.data));
        // Update pagination metadata - Ensure at least 1 page is shown
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      }
    } catch (error) {
      toast.error("Error loading products");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, page, searchProduct]);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseURL}${SummaryApi.getAllCategories.url}`,
      );
      const data = await response.json();
      if (data.success) {
        dispatch(setAllCategories(data.data));
      }
    } catch (error) {
      toast.error("Error loading categories");
      console.error("Fetch Error:", error);
    }
  }, [dispatch]);

  // Fetch all subcategories
  const fetchSubCategories = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseURL}${SummaryApi.getSubCategory.url}`,
      );
      const data = await response.json();
      if (data.success) {
        dispatch(setAllSubCategories(data.data));
      }
    } catch (error) {
      toast.error("Error loading subCategories");
      console.error("Fetch Error:", error);
    }
  }, [dispatch]);

  // Filter subcategories based on the categories selected in the form.
  const filteredSubCategories = allSubCategories.filter((sub) => {
    if (!formData.categories || formData.categories.length === 0) return false;
    const selectedCategoryIds = new Set(formData.categories.map(String));
    return sub.categories.some((cat) =>
      selectedCategoryIds.has(String(cat._id)),
    );
  });

  // Load categories and subcategories only once on component mount
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, [fetchCategories, fetchSubCategories]);

  // Load products whenever the page or fetchProducts function changes
  useEffect(() => {
    setLoading(true);

    // Start a timer to wait for the user to stop typing
    const searchTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    // If the user types again before 300ms, cancel the previous timer
    return () => clearTimeout(searchTimer);
  }, [fetchProducts]);

  // Update URL search params when changing page
  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  // Handle input changes in product form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

    if (allowedControlKeys.includes(e.key)) {
      return;
    }

    if (!/^[0-9.]$/.test(e.key)) {
      e.preventDefault();
    }
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

  // Submit product data to backend using either CREATE or UPDATE ENDPOINT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImages = [];

      if (productImages.length > 0) {
        uploadedImages = await Promise.all(
          productImages.map((img) =>
            uploadToCloudinary(
              img,
              import.meta.env.VITE_CLOUDINARY_PRESET_PRODUCTS,
            ),
          ),
        );
      } else {
        uploadedImages = formData.image;
      }

      const apiConfig = editId
        ? SummaryApi.updateProduct
        : SummaryApi.createProduct;

      const response = await fetch(baseURL + apiConfig.url, {
        method: apiConfig.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          image: uploadedImages,
          _id: editId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        fetchProducts();
        handleReset();
      }
    } catch (error) {
      toast.error("Connection error. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Permanently delete product and refresh global state
  const handleDelete = async (id) => {
    try {
      const response = await fetch(baseURL + SummaryApi.deleteProduct.url, {
        method: SummaryApi.deleteProduct.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ _id: id }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
      toast.error("Connection error. Please try again later.");
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
        loading={loading}
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

          {/* Search Results Logic*/}
          {loading ? (
            <PageLoader />
          ) : allProducts.length > 0 ? (
            <ProductList
              items={allProducts}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400">
                No products found matching your search.
              </p>
            </div>
          )}

          {/* Pagination UI */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-300">
            <button
              className="px-4 py-1.5 bg-white border border-slate-400 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              Prev
            </button>

            <span className="text-sm font-medium text-slate-500">
              <span className="sm:hidden">
                {page} / {totalPages || 1}
              </span>
              <span className="hidden sm:inline">
                Page {page} of {totalPages || 1} (Total: {totalCount || 0})
              </span>
            </span>

            <button
              className="px-4 py-1.5 bg-white border border-slate-400 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
