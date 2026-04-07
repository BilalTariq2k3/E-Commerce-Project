"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUpdateCategoryMutation } from "../../../features/CategoryApi";
import Image from "next/image";

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
}) {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  // ✅ Load fresh backend data when modal opens
  useEffect(() => {
    if (category && isOpen) {
      setForm({
        name: category.name || "",
        description: category.description || "",
      });
      setImage(null); // reset image
    }
  }, [category, isOpen]);

  // ✅ Handle input changes with validation
  const handleChange = (e) => {
    let { name, value } = e.target;

    // 🔹 Name: only letters & numbers (no spaces)
    if (name === "name") {
      value = value.replace(/[^a-zA-Z0-9]/g, "");
    }

    // 🔹 Description: only single spaces
    if (name === "description") {
      value = value.replace(/\s+/g, " ");
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  // ✅ Close modal and reset state
  const handleClose = () => {
    setForm({
      name: "",
      description: "",
    });
    setImage(null);
    onClose();
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Extra validation (safety)
    if (!/^[a-zA-Z0-9]+$/.test(form.name)) {
      toast.error("Name must contain only letters and numbers (no spaces)");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);

      if (image) {
        formData.append("image", image);
      }

      await updateCategory({
        id: category._id,
        formData,
      }).unwrap();

      toast.success("Category updated successfully ✅");

      handleClose(); // reset + close
    } catch (error) {
      toast.error(error?.data?.message || "Update failed ❌");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">Edit Category</h5>
            <button className="btn-close" onClick={handleClose}></button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {/* Name */}
              <div className="mb-3">
                <label>Category Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">
                  Only letters & numbers allowed (no spaces)
                </small>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">
                  Multiple spaces are automatically removed
                </small>
              </div>

              {/* Image */}
              <div className="mb-3">
                <label>Category Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              {/* Preview old image */}
              {category?.image && (
                <Image
                  src={category.image}
                  alt="category"
                  width={100}
                  height={100}
                  className="mt-2"
                />
              )}

            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={handleClose}
              >
                Close
              </button>

              <button
                className="btn btn-primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Category"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}