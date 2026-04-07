"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUpdateProductMutation } from "../../../features/ProductApi";
import Image from "next/image";

export default function EditProductModal({ isOpen, onClose, productId, product, category }) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category_id: "",
  });

  const [image, setImage] = useState(null);

  // ✅ Reset form only when modal opens
  useEffect(() => {
    if (isOpen && product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        quantity: product.quantity || "",
        category_id: product.category_id?._id || "",
      });
      setImage(null); // reset selected image
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "price") value = Math.max(Number(value), 0);
    if (e.target.name === "quantity") value = Math.max(Number(value), 0);

    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(form.price) <= 0) {
      toast.error("Price must be greater than 0 ❌");
      return;
    }
    if (Number(form.quantity) < 0) {
      toast.error("Quantity cannot be negative ❌");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      formData.append("category_id", form.category_id);

      if (image) formData.append("image", image);

      await updateProduct({ id: productId, formData }).unwrap();
      toast.success("Product updated successfully ✅");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Update failed ❌");
    }
  };

  // ✅ Reset form when cancel/close
  const handleClose = () => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        quantity: product.quantity || "",
        category_id: product.category_id?._id || "",
      });
    }
    setImage(null);
    onClose();
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Edit Product</h5>
            <button className="btn-close" onClick={handleClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {/* Name */}
              <div className="mb-3">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
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
              </div>

              {/* Price */}
              <div className="mb-3">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min={0.01}
                  step="0.01"
                />
              </div>

              {/* Quantity */}
              <div className="mb-3">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  min={0}
                />
              </div>

              {/* Category */}
              <div className="mb-3">
                <label>Category</label>
                <select
                  name="category_id"
                  className="form-select"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {category.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image */}
              <div className="mb-3">
                <label>Product Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              {/* Preview old image */}
              {product?.image && !image && (
                <Image
                  src={product.image}
                  alt="product"
                  width={100}
                  height={100}
                  className="mt-2"
                />
              )}

              {/* Preview new selected image */}
              {image && (
                <Image
                  src={URL.createObjectURL(image)}
                  alt="new product"
                  width={100}
                  height={100}
                  className="mt-2"
                />
              )}

            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" onClick={handleClose}>
                Close
              </button>
              <button className="btn btn-primary" type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Product"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}