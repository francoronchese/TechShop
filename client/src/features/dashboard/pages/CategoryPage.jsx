import { useState } from "react";
import toast from "react-hot-toast";
import imageToBase64 from "@utils/imageToBase64";
import uploadToCloudinary from "@helpers/cloudinaryUpload";

// Import RTK Query hooks
import {
  useGetCategoriesQuery,
  useSaveCategoryMutation,
  useDeleteCategoryMutation,
} from "@store/api/apiSlice";

// Components
import CategoryHeader from "../components/category/CategoryHeader";
import CategoryForm from "../components/category/CategoryForm";
import CategoryList from "../components/category/CategoryList";
import { PageLoader } from "@components";

export const CategoryPage = () => {
  // RTK Query: Handles fetching, caching and loading state for categories
  const {
    data: allCategories = [],
    isLoading: loadingList,
    isError: errorList,
  } = useGetCategoriesQuery();

  // RTK Query: Mutation hooks
  const [saveCategory, { isLoading: isSaving }] = useSaveCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // UI state to toggle between the list view and the creation/edit form
  const [isCreating, setIsCreating] = useState(false);
  // Stores the ID of the category being edited, an empty string indicates a new record creation
  const [editId, setEditId] = useState("");
  // Local state for form inputs before it's sent to the server
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  // Handle input changes in category form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Resets form data and other states to initial values
  const handleReset = () => {
    setFormData({ name: "", image: "" });
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
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await imageToBase64(file);
      // Update form data for immediate preview display
      setFormData((prev) => ({ ...prev, image: base64 }));
    } catch (error) {
      toast.error("Failed to process image");
      console.error(error);
    }
  };

  // Submit category data to backend using RTK Query mutation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Determine if the image needs a Cloudinary upload (new base64) or not (existing URL)
      const categoryImage = formData.image.startsWith("data:")
        ? await uploadToCloudinary(
            formData.image,
            import.meta.env.VITE_CLOUDINARY_PRESET_CATEGORIES,
          )
        : formData.image;

      const payload = {
        name: formData.name,
        image: categoryImage,
        ...(editId && { _id: editId }), // The _id is conditionally added only when editing an existing item
      };

      // Executes mutation and unwraps the result to handle it in the try/catch block
      const response = await saveCategory(payload).unwrap();

      if (response.success) {
        toast.success(response.message);
        handleReset();
      }
    } catch (error) {
      // Extracts the specific error message defined in the backend controller
      toast.error(error.data?.message || "Error saving category");
    }
  };

  // Delete category using RTK Query mutation
  const handleDelete = async (id) => {
    try {
      // .unwrap() allows the use of standard try/catch logic with RTK Query
      const response = await deleteCategory({ _id: id }).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      // Catches validation messages (e.g., if category has linked sub-categories)
      toast.error(error.data?.message || "Error deleting category");
    }
  };

  return (
    <div className="p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm border border-slate-300">
      {/* Category Management header with action buttons */}
      <CategoryHeader
        isCreating={isCreating}
        onCreate={() => setIsCreating(true)}
        onCancel={handleReset}
        onSave={handleSubmit}
        loading={isSaving}
      />

      {/* Conditional view: Category creation form or List grid */}
      {isCreating ? (
        <CategoryForm
          formData={formData}
          onChange={handleChange}
          onPhotoUpload={handlePhotoUpload}
        />
      ) : /* Show loader while fetching the categories list */
      loadingList ? (
        <div className="py-20">
          <PageLoader />
        </div>
      ) : errorList ? (
        <div className="py-20 text-center text-red-500">
          Error loading data. Please check your connection.
        </div>
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
