"use client";
import "./cart.css";
import DashboardLayout from "../Components/DashboardLayout/DashboardLayout";
import CartCard from "../Components/CartCard/cartcard";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import PaymentMethodModal from "../Components/PaymentMethodModal/paymentMethodModal";
import {
  useClearCartMutation,
  useCreateOrderMutation,
  useUpdateProductsMutation,
  useGetCartQuery,
} from "../Features/CartApi";
import axios from "axios";

import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://127.0.0.1:5000";

export default function Cart() {
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [paymentModal, setPaymentModal] = useState(false);

  const { data, isLoading, refetch } = useGetCartQuery();
  const cartdata = data?.data || [];

  // console.log('adad',cartdata);

  const [deleteCart] = useClearCartMutation();
  const [createOrder] = useCreateOrderMutation();
  const [updateProduct] = useUpdateProductsMutation();

  const socketRef = useRef(null);

  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
    });
    socketRef.current = s;
    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, []);

  const sum = cartdata.reduce((a, b) => a + (b.totalprice || 0), 0);

  // ✅ Validate shipping info before opening payment modal
  const handleConfirmClick = () => {
    let errors = {};

    // Address: only single spaces allowed, no multiple spaces
    const addressTrimmed = address.trim();
    if (!addressTrimmed) errors.address = "Address is required";
    if (/ {2,}/.test(addressTrimmed))
      errors.address = "Only one space allowed in address";

    // Email: no spaces allowed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) errors.email = "Email is required";
    else if (/\s/.test(email)) errors.email = "No spaces allowed in email";
    else if (!emailRegex.test(email)) errors.email = "Email format invalid";

    // Phone: exactly 11 digits
    const phoneRegex = /^\d{11}$/;
    if (!phone.trim()) errors.phone = "Phone is required";
    else if (!phoneRegex.test(phone))
      errors.phone = "Phone number must contain exactly 11 digits";

    setErrorMessage(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("fill these fields first");
      return;
    }

    // ✅ All valid → open payment modal
    setPaymentModal(true);
  };

  async function confirmOrder(paymentmethod) {
    if (cartdata.length === 0) return toast.error("No item available in cart");

    try {
      const payload = cartdata.map((item) => ({
        productId: item.product?._id,
        quantity: item.quantity,
        totalprice: item.totalprice,
      }));

      await createOrder({
        items: payload,
        email,
        phone,
        address,
        totalbill: sum,
        paymentmethod,
      });

      await deleteCart();
      refetch();

      const updatedProducts = cartdata.map((prod) => ({
        proid: prod.product._id,
        proquantity: prod.productQuantity - prod.quantity,
      }));
      await updateProduct({ products: updatedProducts });
      refetch();

      try {
        const res = await axios.post("/api/email", {
          email: email,
          name: "Junaid ",
          // junaid.arhamsoft4290@gmail.com
          phone,
          address,
          totalbill: sum,
          paymentmethod,
        });

        console.log(res.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }

      socketRef.current?.emit("newOrder", {
        userName: email,
        total: sum,
      });

      toast.success("Order confirmed!");
      setPaymentModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Order not confirmed!");
    }
  }

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

      <div className="chart">
        <h1 className="text-center py-3">Cart Shopping</h1>

        <div className="cart-wrapper">
          <div className="table-responsive">
            <table className="table align-middle text-center cart-table">
              <thead className="table-dark">
                <tr>
                  <th>Product</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>

              <tbody>
                {cartdata.length > 0 ? (
                  cartdata.map((item) => (
                    <CartCard key={item._id} cartItem={item} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No product available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h1 className="text-center py-3">Shipping Information</h1>
          <div className="d-flex justify-content-center mt-1">
            <div className="card shadow-sm p-4 mb-4 w-100">
              <div className="mb-3">
                <label className="form-label fw-semibold">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrorMessage((prev) => ({ ...prev, address: "" }));
                  }}
                  className="form-control"
                />
                {errorMessage.address && (
                  <small className="text-danger">{errorMessage.address}</small>
                )}
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage((prev) => ({ ...prev, email: "" }));
                    }}
                    className="form-control"
                  />
                  {errorMessage.email && (
                    <small className="text-danger">{errorMessage.email}</small>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Contact</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrorMessage((prev) => ({ ...prev, phone: "" }));
                    }}
                    className="form-control"
                  />
                  {errorMessage.phone && (
                    <small className="text-danger">{errorMessage.phone}</small>
                  )}
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-center py-3">Payment Information</h1>
          <div className="d-flex justify-content-center mt-1">
            <div className="card shadow-sm p-4 mb-4 w-100">
              <p className="mb-4 text-center">
                CCD card payment method only available
              </p>
              <p className="fw-bold text-success mb-4 text-center">
                Total: ${sum}
              </p>

              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-success w-50"
                  onClick={handleConfirmClick} // ✅ validate first
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentMethodModal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
        orderConfirm={confirmOrder}
        totalprice={sum}
      />
    </DashboardLayout>
  );
}
