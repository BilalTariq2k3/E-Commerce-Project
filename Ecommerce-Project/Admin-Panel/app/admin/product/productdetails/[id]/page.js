"use client";

import { useParams } from "next/navigation";
import { useGetSingleProductQuery } from "../../../../features/ProductApi";
import Image from "next/image";
import DashboardLayout from "../../../../component/DashboardLayout/DashboardLayout";
import "../productdetail.css";
import Loading from "../../../../component/Loader/Loader";
export default function SingleProductPage() {
  const { id } = useParams(); // get id from URL
  const { data: product, isLoading, error } = useGetSingleProductQuery(id);

  console.log("dddd", product);
  if (isLoading)
    return <Loading/>
  if (error || !product)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Product not found
      </p>
    );

  return (
    <DashboardLayout>
        <div className="container-fluid px-0 py-5 vh-100" style={{ backgroundColor: "whitesmoke" }}>
      <div className=" main ">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            width={550}
            height={350}
          />
        )}
        <div className="product-details">
          <h1>
            {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
          </h1>
          <p>{product.description}</p>
          <p>
            <strong>Category:</strong>{" "}
            {product.category_id?.name || "No Category"}
          </p>
          <h2>{product.price}$</h2>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
