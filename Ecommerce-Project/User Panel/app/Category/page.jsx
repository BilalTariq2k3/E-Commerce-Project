"use client";
import "./Category.css";
import CategoryCard from "../Components/CategoryCard/CategoryCard";
import DashboardLayout from "../Components/DashboardLayout/DashboardLayout";
import { useState } from "react";
import { useGetCategoriesQuery } from "../Features/CategoryApi";

export default function Category() {
  const [limit, setLimit] = useState(8);
  const { data, isLoading } = useGetCategoriesQuery(limit);
  const categories = data?.data || [];

  return (
    <DashboardLayout>
      {isLoading && (
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

      <div className="Category">
        <h1 className="heading mb-5">
          <span className="category-text px-5 py-3">Category</span>
        </h1>

        <div className="d-flex flex-wrap justify-content-center gap-5">
          {categories.map((category) => (
            <div key={category._id}>
              <CategoryCard categorydata={category} />
            </div>
          ))}
        </div>

        <div className="load-more d-flex justify-content-center my-5">
          <button
            className="py-3 px-4"
            onClick={() => setLimit((prev) => prev + 4)}
          >
            Load more
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}