import { useState } from "react";
import toast from "react-hot-toast";

// Import RTK Query hooks for both sub-categories and parent categories
import {
  useGetSubCategoriesQuery,
  useSaveSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetCategoriesQuery,
} from "@store/api/apiSlice";

// Components
import SubCategoryHeader from "../components/subCategory/SubCategoryHeader";
import SubCategoryForm from "../components/subCategory/SubCategoryForm";
import SubCategoryList from "../components/subCategory/SubCategoryList";
import { PageLoader } from "@components";

export const SubCategoryPage = () => {
  // RTK Query: Fetches parent categories for the selection form
  const { data: allCategories = [] } = useGetCategoriesQuery();
  // RTK Query: Handles fetching, caching and loading state for sub-categories
  const {
    data: allSubCategories = [],
    isLoading: loadingList,
    isError: errorList,
  } = useGetSubCategoriesQuery();

  // RTK Query: Mutation hooks
  const [saveSubCategory, { isLoading: isSaving }] =
    useSaveSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  // UI state to toggle between the list view and the creation/edit form
  const [isCreating, setIsCreating] = useState(false);
  // Stores the ID of the sub-category being edited, an empty string indicates a new record creation
  const [editId, setEditId] = useState("");
  // Local state for form inputs before it's sent to the server
  const [formData, setFormData] = useState({
    name: "",
    categories: [],
  });

  // Handle input changes in sub-category form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggles the selection of a category ID within the formData state.
  // If the ID exists, it is removed. Otherwise, it is added to the array
  const handleToggle = (id) => {
    const current = formData.categories;
    // Determine new state by checking current inclusion
    const categories = current.includes(id)
      ? current.filter((c) => c !== id) // Remove ID if already selected
      : [...current, id]; // Append ID if not selected

    // Update of the form state
    setFormData({ ...formData, categories });
  };

  // Resets form data and other states to initial values
  const handleReset = () => {
    setFormData({ name: "", categories: [] });
    setIsCreating(false);
    setEditId("");
  };

  // Load sub-category data into form for editing
  const handleEdit = (subCategory) => {
    setFormData({
      name: subCategory.name,
      // Map populated category objects to their IDs for the form checkboxes
      categories: subCategory.categories.map((cat) => cat._id),
    });
    // Set the ID for the handleSubmit logic to trigger an update
    setEditId(subCategory._id);
    // Switch view from List to Form
    setIsCreating(true);
  };

  // Submit sub-category data to backend using RTK Query mutation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        categories: formData.categories,
        ...(editId && { _id: editId }), // The _id is conditionally added only when editing an existing item
      };

      // Executes mutation and unwraps the result to handle it in the try/catch block
      const response = await saveSubCategory(payload).unwrap();

      if (response.success) {
        toast.success(response.message);
        handleReset();
      }
    } catch (error) {
      // Extracts the specific error message defined in the backend controller
      toast.error(error.data?.message || "Error saving sub-category");
    }
  };

  // Delete sub-category using RTK Query mutation
  const handleDelete = async (id) => {
    try {
      // .unwrap() allows the use standard of try/catch logic with RTK Query
      const response = await deleteSubCategory({ _id: id }).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.data?.message || "Error deleting sub-category");
    }
  };

  return (
    <div className="p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Sub-Category Management header with action buttons */}
      <SubCategoryHeader
        isCreating={isCreating}
        onCreate={() => setIsCreating(true)}
        onCancel={handleReset}
        onSave={handleSubmit}
        loading={isSaving}
      />

      {/* Conditional view: Sub-category creation form or List grid */}
      {isCreating ? (
        <SubCategoryForm
          formData={formData}
          onChange={handleChange}
          onToggle={handleToggle}
          allCategories={allCategories}
        />
      ) : /* Show loader while fetching the sub-categories list */
      loadingList ? (
        <div className="py-20">
          <PageLoader />
        </div>
      ) : errorList ? (
        <div className="py-20 text-center text-red-500">
          Error loading data. Please check your connection.
        </div>
      ) : (
        <SubCategoryList
          items={allSubCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
