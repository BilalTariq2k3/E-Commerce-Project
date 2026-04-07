"use client";

import DashboardLayout from "../../component/DashboardLayout/DashboardLayout";
import { useGetProductsQuery } from "../../features/ProductApi";
import ProductCard from "../../component/Product/ProductCard/ProductCard";
import { useState, useEffect } from "react";
import AddProductModal from "../../component/Product/AddProductModal/AddProductModal";
import ProductDeleteModal from "../../component/Product/DeleteProductModal/DeleteProductModal";
import ProductEditModal from "../../component/Product/EditProductModal/EditProductModal";
import Loading from "../../component/Loader/Loader";

export default function Product() {
  const { data, isLoading, error, refetch } = useGetProductsQuery();
  const products = data?.products || [];
  const categories = data?.categories || [];

  const [addProductModal, setAddProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    refetch();
  }, [data, refetch]);

  console.log("data product", products);

  if (isLoading) return <Loading />;
  if (error) return <p>Error...</p>;

  return (
    <DashboardLayout>
      <div
        className="container-fluid px-0 vh-100"
        style={{ backgroundColor: "whitesmoke" }}
      >
        <h1 className="d-flex justify-content-center py-3">Product</h1>

        <div className="d-flex justify-content-end me-5 mb-3">
          <button
            className="btn btn-primary"
            onClick={() => setAddProductModal(true)}
          >
            Add Product
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
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  productdata={product}
                  onDelete={() => {
                    setSelectedProduct(product);
                    setDeleteOpen(true);
                  }}
                  onEdit={(id) => {
                    const product = products.find((p) => p._id === id); // ✅ find full product
                    setSelectedProduct(product); // ✅ store full object
                    setSelectedProductId(id); // (optional)
                    setEditOpen(true);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>

        <AddProductModal
          isOpen={addProductModal}
          onClose={() => setAddProductModal(false)}
          categoryName={categories}
        />

        <ProductDeleteModal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          product={selectedProduct}
        />

        <ProductEditModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          productId={selectedProductId}
          product={selectedProduct} // ✅ full data
          category={categories}
        />
      </div>
    </DashboardLayout>
  );
}
