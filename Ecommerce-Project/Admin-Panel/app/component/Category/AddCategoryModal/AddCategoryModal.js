"use client";
import { useState } from "react";
import { useAddCategoryMutation } from "../../../features/CategoryApi";
import { toast } from "react-toastify";
import Image from "next/image";

export default function AddCategoryModal({ isOpen, onClose }) {
  const [addCategory] = useAddCategoryMutation();
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  // 🔹 Clean text
  const cleanText = (text) => text.trim().replace(/\s+/g, " ");

  // 🔹 Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const name = cleanText(form.get("name"));
    const description = cleanText(form.get("description"));
    const image = form.get("image");

    // ✅ Validation
    if (!name || !description) {
      toast.error("All fields are required!");
      return;
    }

    if (!image || image.size === 0) {
      toast.error("Image is required!");
      return;
    }

    // 🔹 Send form data
    const data = new FormData();
    data.append("name", name);
    data.append("description", description);
    data.append("image", image);

    try {
      await addCategory(data).unwrap();
      toast.success("Category added successfully ✅");
      setPreview(null);
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Category</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Name */}
              <div className="mb-3">
                <label>Category Name</label>
                <input type="text" name="name" className="form-control" required />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label>Description</label>
                <textarea name="description" className="form-control" required />
              </div>

              {/* Image Upload */}
              <div className="mb-3">
                <label>Category Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="mb-3 text-center">
                  <img src={preview} width="120" style={{ borderRadius: "8px" }} />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" onClick={onClose}>
                Close
              </button>
              <button className="btn btn-primary" type="submit">
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}