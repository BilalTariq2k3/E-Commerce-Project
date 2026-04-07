"use client";

import { useAddProductMutation } from "../../../features/ProductApi";
import { toast } from "react-toastify";
import { useState } from "react";

export default function AddProductModal({ isOpen, onClose, categoryName = [] }) {
  const [addProduct] = useAddProductMutation();
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  // 🔹 Clean text
  const cleanText = (text) => text.trim().replace(/\s+/g, " ");

  // 🔹 Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    let name = cleanText(form.get("name"));
    let description = cleanText(form.get("description"));
    let price = form.get("price");
    let quantity = form.get("quantity");
    let category_id = form.get("category");
    let image = form.get("image");

    // ✅ Validation
    if (!name || !description || !price || !quantity || !category_id) {
      toast.error("All fields are required!");
      return;
    }

    if (!image || image.size === 0) {
      toast.error("Image is required!");
      return;
    }

    if (Number(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (Number(quantity) < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    // 🔹 Create FormData
    const data = new FormData();
    data.append("name", name);
    data.append("description", description);
    data.append("price", price);
    data.append("quantity", quantity);
    data.append("category_id", category_id);
    data.append("image", image);

    try {
      await addProduct(data).unwrap();

      toast.success("Product added successfully ✅");
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
            <h5 className="modal-title">Add Product</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {/* Name */}
              <div className="mb-3">
                <label>Product Name</label>
                <input type="text" name="name" className="form-control" required />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label>Description</label>
                <textarea name="description" className="form-control" required />
              </div>

              {/* Price */}
              <div className="mb-3">
                <label>Price</label>
                <input type="number" name="price" className="form-control" required />
              </div>

              {/* Quantity */}
              <div className="mb-3">
                <label>Quantity</label>
                <input type="number" name="quantity" defaultValue={1} min={1} className="form-control" required />
              </div>

              {/* Category */}
              <div className="mb-3">
                <label>Category</label>
                <select name="category" className="form-select" required>
                  <option value="">Select Category</option>
                  {categoryName.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="mb-3">
                <label>Product Image</label>
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
                Add Product
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}