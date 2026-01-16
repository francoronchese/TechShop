import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import SummaryApi, { baseURL } from "@config/summaryApi";
import { setAllCategories } from "@store/slices/categorySlice";
import imageToBase64 from "@utils/imageToBase64";
import uploadToCloudinary from "@helpers/cloudinaryUpload";
import CategoryHeader from "../components/category/CategoryHeader";
import CategoryForm from "../components/category/CategoryForm";
import CategoryList from "../components/category/CategoryList";

export const CategoryPage = () => {
  // Get category data from Redux store
  const { allCategories } = useSelector((state) => state.category);
  // Send actions to update Redux store
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });
  // State to store the ID of the category being edited
  const [editId, setEditId] = useState("");
  // Temporary base64 image for preview before Cloudinary upload
  const [categoryImage, setCategoryImage] = useState("");

  // Fetch all categories from backend and update Redux store
  // useCallback memoizes this function to prevent infinite loops in useEffect
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(baseURL + SummaryApi.getAllCategories.url);
      const data = await res.json();

      if (data.success) {
        // Set Redux store with all categories data
        dispatch(setAllCategories(data.data));
      }
    } catch (error) {
      toast.error("Connection error. Please try again later.");
      console.log(error);
    }
  }, [dispatch]);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle input changes in category form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Resets form data and other states to initial values
  const handleReset = () => {
    setFormData({
      name: "",
      image: "",
    });
    setCategoryImage("");
    setIsCreating(false);
    setEditId("");
  };

  // Load existing category data into form and switch to form view
  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      image: category.image,
    });
    // Set the ID for the handleSubmit logic to trigger an update
    setEditId(category._id);
    // Switch view from List to Form
    setIsCreating(true);
  };

  // Handle category image selection and convert to base64 for preview
  const handlePhotoUpload = async (e) => {
    // Get first file from input (user can only select one image)
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await imageToBase64(file);
      setCategoryImage(base64);
      // Update form data for immediate preview display
      setFormData((prev) => ({ ...prev, image: base64 }));
    } catch (error) {
      toast.error("Failed to process image");
      console.log(error);
    }
  };

  // Submit category data to backend using either CREATE or UPDATE ENDPOINT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image || "";
      if (categoryImage) {
        imageUrl = await uploadToCloudinary(
          categoryImage,
          import.meta.env.VITE_CLOUDINARY_PRESET_CATEGORIES,
        );
      }

      // Determine the API configuration based on the presence of editId
      const apiConfig = editId
        ? SummaryApi.updateCategory
        : SummaryApi.createCategory;

      const res = await fetch(baseURL + apiConfig.url, {
        method: apiConfig.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          _id: editId, // Pass ID for updates (ignored by create if empty)
          name: formData.name,
          image: imageUrl, // Cloudinary URL
        }),
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        fetchCategories();
        handleReset();
      }
    } catch (error) {
      toast.error("Connection error. Please try again later.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Permanently delete category and refresh global state
  const handleDelete = async (id) => {
    try {
      const res = await fetch(baseURL + SummaryApi.deleteCategory.url, {
        method: SummaryApi.deleteCategory.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ _id: id }),
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        fetchCategories();
      }
    } catch (error) {
      toast.error("Connection error");
      console.log(error);
    }
  };

  return (
    <div className="p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Category Management header with action buttons */}
      <CategoryHeader
        isCreating={isCreating}
        onCreate={() => setIsCreating(true)}
        onCancel={handleReset}
        onSave={handleSubmit}
        loading={loading}
      />

      {/* Conditional view: Category creation form or List grid */}
      {isCreating ? (
        <CategoryForm
          formData={formData}
          onChange={handleChange}
          onPhotoUpload={handlePhotoUpload}
        />
      ) : (
        <CategoryList
          items={allCategories}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};
