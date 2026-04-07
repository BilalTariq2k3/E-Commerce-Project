import axios from "axios";
import { toast } from "react-toastify";

export default function PaymentMethodModal({
  isOpen,
  onClose,
  orderConfirm,
  totalprice,
}) {
  const handleCheckout = async () => {
    try {
      const res = await axios.post("/api/checkout", {
        items: [
          {
            price: Number(totalprice),
          },
        ],
      });

      toast.info("Redirecting to payment...");
      window.location.href = res.data.url;
       orderConfirm("card payment");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start payment. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header  ">
            <h2 className="modal-title w-100 text-center">Payment Method</h2>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-column justify-content-between align-items-center my-4"></div>
            <div className="modal-buttons d-flex justify-content-center gap-5">
              <button
                className="btn btn-primary px-4 py3"
                onClick={() => orderConfirm("cash on delivery")}
              >
                COD
              </button>
              <button
                className="btn btn-primary px-4 py3"
                onClick={handleCheckout}
              >
                Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
