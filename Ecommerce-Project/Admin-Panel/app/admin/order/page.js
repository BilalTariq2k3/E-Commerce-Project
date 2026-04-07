"use client";

import DashboardLayout from "../../component/DashboardLayout/DashboardLayout";
import { useGetOrdersQuery } from "../../features/OrderApi";
import OrderCard from "../../component/Order/OrderCard/OrderCard";
import Loading from "../../component/Loader/Loader";


export default function Order() {
  



  const { data, isLoading, error } = useGetOrdersQuery();

  const orders = data || [];

//   console.log('cate',orders);

  if (isLoading) return <Loading/>;
  if (error) return <p>Error loading orders</p>;

  return (
    <DashboardLayout>
      <div className="container-fluid px-0 vh-100" style={{ backgroundColor: "whitesmoke" }}>
      <h1 className="d-flex justify-content-center py-3">Orders</h1>


      <div
        className="table-responsive mx-auto my-4"
        style={{ maxWidth: "90%" }}
      >
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
                  <th>#</th>
              <th>Name</th>
              <th>Email</th>
                 <th>Phone</th>
              <th>Total Bill</th>
              <th>Payment Method</th>
                <th>Date</th>
                  <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order,index) => (
              <OrderCard
                key={order._id}
                orderdata={order}
                  index={index} 
               
              />
            ))}
          </tbody>
        </table>
      </div>

  </div>
    </DashboardLayout>
  );
}
