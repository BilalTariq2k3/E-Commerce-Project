"use client";


import { useDeleteCategoryMutation } from "../../../features/CategoryApi";
import { toast } from "react-toastify";

export default function CategoryDeleteModal({ isOpen, onClose,category }) {
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

  const handleDelete = async () => {
    try {
      await deleteCategory(category._id).unwrap();
      toast.success("Category deleted successfully");
      onClose();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete Category");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title w-100 text-center">Confirm Delete</h2>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="d-flex flex-column justify-content-center align-items-center my-4">
              <h4>Are you sure you want to delete:</h4>
            </div>

            <div className="modal-buttons d-flex justify-content-center gap-5">
              <button
                className="btn btn-danger px-4 py-3"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>

              <button
                className="btn btn-secondary px-4 py-3"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}