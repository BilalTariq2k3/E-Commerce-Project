"use client";
import { useState } from "react";
import DashboardLayout from "../../component/DashboardLayout/DashboardLayout";
import { useGetCategoriesQuery } from "../../features/CategoryApi";
import CategoryCard from "../../component/Category/CategoryCard/CategoryCard";
import AddCategoryModal from "../../component/Category/AddCategoryModal/AddCategoryModal";
import EditCategoryModal from "../../component/Category/EditCategoryModal/EditCategoryModal";
import CategoryDeleteModal from "../../component/Category/DeleteCategoryModal/DeleteCategoryModal";
import Loading from "../../component/Loader/Loader";

export default function Category() {
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);

  const { data, isLoading, error } = useGetCategoriesQuery();

  const categories = data || [];

console.log("API error:", error);
console.log("API data:", data);
  if (isLoading) return <Loading/>;
  if (error) return <p>Error loading categories</p>;

  return (
    <DashboardLayout>
      <div className="container-fluid px-0 vh-100" style={{ backgroundColor: "whitesmoke" }}>
      <h1 className="d-flex justify-content-center my-3">Categories</h1>

      <div className="d-flex justify-content-end me-5 mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setAddCategoryModal(true)}
        >
          Add Category
        </button>
      </div>

      <div
        className="table-responsive mx-auto my-4"
        style={{ maxWidth: "90%" }}
      >
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                categorydata={category}
                onDelete={() => {
                  setSelectedCategory(category);
                  setDeleteCategoryModal(true);
                }}
                onEdit={() => {
                  setSelectedCategory(category); // ✅ directly use it
                  setEditCategoryModal(true); // ✅ open modal
                }}
              />
            ))}
          </tbody>
        </table>
      </div>

      <AddCategoryModal
        isOpen={addCategoryModal}
        onClose={() => setAddCategoryModal(false)}
      />

      <EditCategoryModal
        isOpen={editCategoryModal}
        onClose={() => setEditCategoryModal(false)}
        category={selectedCategory} // ✅ full data
      />

      <CategoryDeleteModal
        isOpen={deleteCategoryModal}
        onClose={() => setDeleteCategoryModal(false)}
        category={selectedCategory}
      />
      </div>
    </DashboardLayout>
  );
}
