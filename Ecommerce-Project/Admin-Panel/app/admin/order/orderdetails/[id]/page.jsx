"use client";
import "./singleorder.css";
import DashboardLayout from "../../../../component/DashboardLayout/DashboardLayout";
import { useParams } from "next/navigation";
import { useGetSingleOrderQuery } from "../../../../features/OrderApi";
import Image from "next/image";
import Loading from "../../../../component/Loader/Loader";
export default function SingleOrderPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetSingleOrderQuery(id);

  // ✅ Loading State
  if (isLoading) {
    return <Loading/>
  }

  // ✅ Error State
  if (error) return <p className="text-center mt-5">Error loading order</p>;
  if (!data) return <p className="text-center mt-5">No order found</p>;

  return (
    <DashboardLayout>
        <div className="container-fluid px-0 vh-100" style={{ backgroundColor: "whitesmoke" }}>
   <div className="chart px-2">
      {/* ✅ Container for left/right spacing */}
      <div className="container py-3">
     

          <h1 className="text-center py-3">Order Details</h1>

          <div className="cart-wrapper">

            {/* ================== ITEMS TABLE ================== */}
            <div className="table-responsive">
              <table className="table align-middle text-center cart-table">
                <thead className="table-dark">
                  <tr>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {data.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Image
                          src={item.productId?.image}
                          alt="product"
                          width="60"
                          height="60"
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td>{item.productId?.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.productId?.price}</td>
                      <td>
                        ${item.quantity * item.productId?.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================== USER INFO ================== */}
          <h1 className="text-center py-3">User Information</h1>

{/* ✅ Full width background wrapper */}
<div className="user-info-wrapper py-4">
  <div className="container">

    <div className="card shadow-sm p-4">

      {/* Row 1 → Name + Email */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Name</label>
          <p className="form-control-plaintext">
            {data.userId?.fname} {data.userId?.lname}
          </p>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Email</label>
          <p className="form-control-plaintext">{data.email}</p>
        </div>
      </div>

      {/* Row 2 → Phone + Address */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Contact</label>
          <p className="form-control-plaintext">{data.phone}</p>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Address</label>
          <p className="form-control-plaintext">{data.address}</p>
        </div>
      </div>

      {/* Row 3 → Date */}
      <div className="row">
        <div className="col-12">
          <label className="form-label fw-semibold">Order Date</label>
          <p className="form-control-plaintext">
            {new Date(data.createdAt).toLocaleDateString("en-PK", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

    </div>

  </div>
</div>

            {/* ================== PAYMENT INFO ================== */}
            <h1 className="text-center py-3">Payment Information</h1>
            <div className="d-flex justify-content-center mt-1">
              <div className="card shadow-sm p-4 mb-4 w-100">
                <p className="mb-4 text-center">
                  Payment Method: {data.paymentmethod}
                </p>

                <p className="fw-bold text-success mb-4 text-center">
                  Total: ${data.totalbill}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}