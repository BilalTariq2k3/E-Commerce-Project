"use client";

import { useParams } from "next/navigation";
import { useGetSingleCategoryQuery } from "../../../../features/CategoryApi";
import Image from "next/image";
import DashboardLayout from '../../../../component/DashboardLayout/DashboardLayout';
import '../categorydetail.css';
import Loading from "../../../../component/Loader/Loader";

export default function SingleCategoryPage() {
  const { id } = useParams(); // get id from URL
  const { data: category, isLoading, error } = useGetSingleCategoryQuery(id);

  if (isLoading)
    return <Loading/>

  if (error || !category)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Category not found</p>;

  return (
    <DashboardLayout>
         <div className="container-fluid px-0 vh-100" style={{ backgroundColor: "whitesmoke" }}>
      <div className="main container my-4">
        {/* Category Image */}
        {category.image && (
          <div className="text-center mb-4">
            <Image
              src={category.image}
              alt={category.name}
              width={550}
              height={350}
              className="rounded"
            />
          </div>
        )}

        {/* Category Details */}
        <div className="product-details">
          <h1 className="mb-3">
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </h1>

          <p className="mb-3">{category.description}</p>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}