"use client";

import "./product.css";
import DashboardLayout from "../Components/DashboardLayout/DashboardLayout";
import ProductCard from "../Components/ProductCard/ProductCard";
import { useEffect, useState } from "react";

import { useGetPostsQuery } from "../Features/ProductApi"; // adjust path

export default function Product() {
  const [limit, setLimit] = useState(8);
  const [searchName, setSearchName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");


  const [debouncedFilters, setDebouncedFilters] = useState({
    limit: 8,
    searchName: "",
    minPrice: "",
    maxPrice: "",
  });

  // ✅ Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({
        limit,
        searchName,
        minPrice,
        maxPrice,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [limit, searchName, minPrice, maxPrice]);

  // ✅ RTK Query call
  const { data, isLoading } = useGetPostsQuery(debouncedFilters);

  const products = data?.data || [];

  return (
    <DashboardLayout>
      {isLoading && (
        <div className="overlay-loader">
          <div className="spinner-border text-primary" />
        </div>
      )}

      <div className="Product">
 
        <div className="py-4 d-flex justify-content-center">
          <div className="filter-box p-4">
            <h4 className="mb-3">Filters</h4>

            <div className="row g-5 align-items-center">
         
              <div className="col-md-4">
                <h6>Search by Name</h6>
                <input
                  type="text"
                  className="form-control"
                  value={searchName}
                  onChange={(e) => {
                    let value = e.target.value
                      .replace(/[^A-Za-z ]/g, "")
                      .replace(/\s+/g, " ");
                    setSearchName(value);
                  }}
                />
              </div>

           
              <div className="col-md-4">
                <h6>Min Price</h6>
                <input
                  type="number"
                  className="form-control"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>

            
              <div className="col-md-4">
                <h6>Max Price</h6>
                <input
                  type="number"
                  className="form-control"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
            </div>
          </div>
        </div>

       
        <div className="d-flex flex-wrap justify-content-center gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} productdata={product} />
          ))}
        </div>

       
        <div className="load-more d-flex justify-content-center my-5">
          <button
            className="py-3 px-4 mb-4"
            onClick={() => setLimit((prev) => prev + 4)}
          >
            Load more
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
