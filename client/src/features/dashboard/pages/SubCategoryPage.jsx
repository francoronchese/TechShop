import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import SummaryApi, { baseURL } from "@config/summaryApi";
import { setAllCategories } from "@store/slices/categorySlice";
import { setAllSubCategories } from "@store/slices/subCategorySlice";
import SubCategoryHeader from "../components/subCategory/SubCategoryHeader";
import SubCategoryForm from "../components/subCategory/SubCategoryForm";
import SubCategoryList from "../components/subCategory/SubCategoryList";
import { PageLoader } from "@components";

export const SubCategoryPage = () => {
  // Get sub-category and category data from Redux store
  const { allCategories } = useSelector((state) => state.category);
  const { allSubCategories } = useSelector((state) => state.subCategory);
  // Send actions to update Redux store
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  // State to store the ID of the sub-category being edited
  const [editId, setEditId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    categories: [],
  });

  // Fetch all parent categories from backend and update Redux store
  // useCallback memoizes this function to prevent infinite loops in useEffect
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(baseURL + SummaryApi.getAllCategories.url);
      const data = await res.json();
      if (data.success) {
        dispatch(setAllCategories(data.data));
      }
    } catch (error) {
      toast.error("Connection error. Please try again later.");
      console.log(error);
    }
  }, [dispatch]);

  // Fetch all sub-categories from backend and update Redux store
  // Memoized to ensure stable reference for the useEffect dependency array
  const fetchSubCategories = useCallback(async () => {
    try {
      const res = await fetch(baseURL + SummaryApi.getSubCategory.url);
      const data = await res.json();
      if (data.success) {
        dispatch(setAllSubCategories(data.data));
      }
    } catch (error) {
      toast.error("Error loading sub-categories");
      console.error("Fetch Error:", error);
    }
  }, [dispatch]);

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      // Wait for both requests to complete
      await Promise.all([fetchCategories(), fetchSubCategories()]);
      setLoading(false);
    };

    loadInitialData();
  }, [fetchCategories, fetchSubCategories]);

  // Handle input changes in sub-category form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggles the selection of a category ID within the formData state.
  // If the ID exists, it is removed; otherwise, it is added to the array.
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
    setFormData({
      name: "",
      categories: [],
    });
    setIsCreating(false);
    setEditId("");
  };

  // Load existing sub-category data into form and switch to form view
  const handleEdit = (subCategory) => {
    setFormData({
      name: subCategory.name,
      // Convert populated category objects into an array of IDs for the checkboxes
      categories: subCategory.categories.map((cat) => cat._id),
    });
    // Set the ID for the handleSubmit logic to trigger an update
    setEditId(subCategory._id);
    // Switch view from List to Form
    setIsCreating(true);
  };

  // Submit sub-category data to backend using either CREATE or UPDATE ENDPOINT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine the API configuration based on the presence of editId
      const apiConfig = editId
        ? SummaryApi.updateSubCategory
        : SummaryApi.createSubCategory;

      const res = await fetch(baseURL + apiConfig.url, {
        method: apiConfig.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          _id: editId, // Pass ID for updates (ignored by create if empty)
          name: formData.name,
          categories: formData.categories,
        }),
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        fetchSubCategories();
        handleReset();
      }
    } catch (error) {
      toast.error("Connection error. Please try again later.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Permanently delete sub-category and refresh global state
  const handleDelete = async (id) => {
    try {
      const res = await fetch(baseURL + SummaryApi.deleteSubCategory.url, {
        method: SummaryApi.deleteSubCategory.method,
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
        fetchSubCategories();
      }
    } catch (error) {
      toast.error("Connection error");
      console.log(error);
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
        loading={loading}
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
      loading ? (
        <div className="py-20">
          <PageLoader />
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
