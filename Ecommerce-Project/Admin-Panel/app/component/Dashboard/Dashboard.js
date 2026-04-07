"use client";
import "./dashboard.css";
import { useRouter } from "next/navigation";
import { useGetDashboardStatsQuery } from "../../features/DashboardApi";
import { useEffect } from "react";

export default function DashboardComponent() {
  const router = useRouter();
  const { data, refetch } = useGetDashboardStatsQuery();

  const totalUsers = data?.totalUsers ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const totalCategories = data?.totalCategories ?? 0;
  const totalProducts = data?.totalProducts ?? 0;

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <div className="main">
        <div className="row boxes gy-4 d-flex justify-content-evenly py-2">
          <div className="Pending-box col-12 col-md-3 text-center py-4">
            <h4>Total Users</h4>
            <p>{totalUsers} Users</p>
            <button
              className="px-3 py-2 box-button"
              onClick={() => router.push("/admin/user")}
            >
              Explore your Users
            </button>
          </div>

          <div className="Order-box col-12 col-md-3 text-center py-4">
            <h4>Total Orders</h4>
            <p>{totalOrders} Orders</p>
            <button
              className="px-3 py-2 box-button"
              onClick={() => router.push("/admin/order")}
            >
              Explore your order
            </button>
          </div>

          <div className="w-100 d-none d-md-block"></div>

          <div className="Category-box col-12 col-md-3 text-center py-4">
            <h4>Total Categories</h4>
            <p>{totalCategories} Categories</p>
            <button
              className="px-3 py-2 box-button"
              onClick={() => router.push("/admin/category")}
            >
              Explore Categories
            </button>
          </div>

          <div className="Tracking-box col-12 col-md-3 text-center py-4">
            <h4>Total Products</h4>
            <p>{totalProducts} Products</p>
            <button
              className="px-3 py-2 box-button"
              onClick={() => router.push("/admin/product")}
            >
              All Products
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
