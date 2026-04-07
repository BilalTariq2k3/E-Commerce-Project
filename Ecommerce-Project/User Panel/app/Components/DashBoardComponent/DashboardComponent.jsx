"use client";
import "./dashboard.css";
import { useRouter } from "next/navigation";
import DashboardCategoryCard from "./DashboardCategoryCard";
import DashboardProductCard from "./DashboardProductCard";
import {
  useGetDashboardCountsQuery,
  useGetHotDashboardItemsQuery,
} from "../../Features/DashboardApi";
import { useEffect } from "react";

export default function DashboardComponentPage() {
  const router = useRouter();

  // ✅ Counts
  const {
    data: countsData,
    isLoading: countsLoading,
    refetch: countRefresh,
  } = useGetDashboardCountsQuery();

  const totalOrders = countsData?.data?.totalOrders || 0;
  const totalCartItem = countsData?.data?.totalCartItems || 0;
  const totalProduct = countsData?.data?.totalProductItems || 0;

  // ✅ Hot items
  const { data: hotData, isLoading: hotLoading } =
    useGetHotDashboardItemsQuery(3);
  const productdata = hotData?.data?.ProductData || [];
  const categorydata = hotData?.data?.CategoryData || [];

  const loading = countsLoading || hotLoading;
  useEffect(() => {
    countRefresh();
  }, []);
  return (
    <>
      {loading && (
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
      )}

      <div className="main">
        <div className="row boxes gap-5 d-flex justify-content-center py-2">
          <div className="Pending-box col-3 text-center py-4">
            <h4>Pending</h4>
            <p>{totalCartItem} items are Pending in cart</p>
            <button
              className="px-3 py-2 box-button"
              onClick={() => router.push("/Cart")}
            >
              Explore your cart
            </button>
          </div>

          <div className="Order-box col-3 text-center py-4">
            <h4>Order</h4>
            <p>{totalOrders} Orders</p>
            <button
              className="px-3 py-2 box-button"
              onClick={() => router.push("/Order")}
            >
              Explore your order
            </button>
          </div>

          <div className="Tracking-box col-3 text-center py-4">
            <h4>Total Products</h4>
            <p>{totalProduct} Products</p>
            <button
              className="px-3 py-2 box-button"
              onClick={() => router.push("/Product")}
            >
              All Products
            </button>
          </div>
        </div>

        <div className="container d-flex justify-content-between">
          <div
            className="p-3"
            style={{
              width: "570px",
              backgroundColor: "#f0f0f1",
              borderRadius: "20px",
            }}
          >
            <h1 className="text-center py-3">Hot Selling Category</h1>
            <div className="dashboard-category-list">
              {Array.isArray(categorydata) &&
                categorydata.map((category) => (
                  <DashboardCategoryCard key={category._id} data={category} />
                ))}
            </div>
            <div className="text-center py-2">
              <button
                className="btn btn-success px-5 py-2"
                onClick={() => router.push("/Category")}
              >
                View all category
              </button>
            </div>
          </div>

          <div
            className="p-3"
            style={{
              width: "570px",
              backgroundColor: "#f0f0f1",
              borderRadius: "20px",
            }}
          >
            <h1 className="text-center py-3">Hot Selling Product</h1>
            <div className="dashboard-category-list">
              {Array.isArray(productdata) &&
                productdata.map((product) => (
                  <DashboardProductCard key={product._id} data={product} />
                ))}
            </div>
            <div className="text-center py-2">
              <button
                className="btn btn-success px-5 py-2"
                onClick={() => router.push("/Product")}
              >
                View all product
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
