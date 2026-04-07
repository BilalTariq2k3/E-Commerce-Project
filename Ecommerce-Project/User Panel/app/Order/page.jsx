"use client";

import DashboardLayout from "../Components/DashboardLayout/DashboardLayout";
import OrderCard from "../Components/Ordercard/ordercard";
import "./order.css";
import { useGetOrdersQuery } from "../Features/OrderApi";
import { useEffect } from "react";

export default function Order() {
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrdersQuery();

  useEffect(() => {
    refetch();
  }, []);

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

      {isError && (
        <div className="alert alert-danger text-center my-3">
          {error?.data?.error || "Failed to fetch orders"}
        </div>
      )}

      <div className="chart">
        <h1 className="text-center py-3">Order History</h1>

        <div className="container-fluid mt-4">
          <div className="cart-wrapper w-100">
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center cart-table w-100">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Order Id</th>
                    <th>Date</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>View Order</th>
                  </tr>
                </thead>

                <tbody>
                  {order && order.data.length > 0 ? (
                    order.data.map((item, index) => (
                      <OrderCard
                        key={item._id}
                        orderData={item}
                        index={index + 1}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No order available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
