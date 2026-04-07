"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import DashboardLayout from "../../Components/DashboardLayout/DashboardLayout";
import ProductRating from "../../Components/ProductRating/ProductRating";
import { useState } from "react";
import { useGetOrderByIdQuery } from "../../Features/OrderApi";

export default function OrderCardDetail() {
  const { id } = useParams();
const { data, isLoading, isError } = useGetOrderByIdQuery(id, {
  refetchOnMountOrArgChange: true,
});

const orderData = data?.data; // ✅ extract actual order

  const [productRatingModal, setProductRatingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  if (isLoading)
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (isError) return <p className="text-center mt-5">Failed to load order.</p>;

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-center mt-4">
        <div className="w-100" style={{ maxWidth: "1000px" }}>
          <h1 className="text-center py-3">Product Details</h1>
          <div className="table-responsive">
            {orderData?.items?.length > 0 ? (
              <table className="table table-striped align-middle text-center w-100">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <Image
                          src={item.productId.image || "/uploads/placeholder.jpg"}
                          alt="product"
                          width={70}
                          height={70}
                          className="cart-img"
                        />
                      </td>
                      <td>{item.productId.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.productId.price}$</td>
                      <td>{item.productId.price * item.quantity}$</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            setSelectedProduct(item);
                            setProductRatingModal(true);
                          }}
                        >
                          {item.rating && item.rating > 0 ? "Edit Rating" : "Add Rating"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">No items in this order.</p>
            )}
          </div>

          <h1 className="text-center py-3">Shipping Information</h1>
          <div className="d-flex justify-content-center mt-3">
            <div className="card shadow-sm p-3 mb-4 w-100" style={{ maxWidth: "1000px" }}>
              <div className="mb-2 d-flex">
                <span className="fw-semibold me-2">Address:</span>
                <span>{orderData.address || "N/A"}</span>
              </div>
              <div className="d-flex flex-wrap">
                <div className="d-flex me-5 mb-2">
                  <span className="fw-semibold me-2">Email:</span>
                  <span>{orderData.email || "N/A"}</span>
                </div>
              </div>
              <div className="d-flex mb-2">
                <span className="fw-semibold me-2">Contact:</span>
                <span>{orderData.phone || "N/A"}</span>
              </div>
            </div>
          </div>

          <h1 className="text-center py-3">Payment Information</h1>
          <div className="d-flex justify-content-center mt-1">
            <div className="card shadow-sm p-4 mb-4 w-100" style={{ maxWidth: "1000px" }}>
              <p className="mb-4 text-center">CCD card payment method only available</p>
              <p className="fw-bold text-success mb-4 text-center">
                Total: {orderData.totalbill}$
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProductRating
        isOpen={productRatingModal}
        onClose={() => setProductRatingModal(false)}
        data={selectedProduct}
        refresh={triggerRefresh}
      />
    </DashboardLayout>
  );
}