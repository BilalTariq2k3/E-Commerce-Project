
import "./ProductConfirmModal.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {useAddToCartMutation} from '../../Features/CartApi';

export default function ProductConfirmModal({
  isOpen,
  onClose,
  product,
  ProductPrice,
  ProductQuantity,
}) {
  const router = useRouter();

 const [addToCart] = useAddToCartMutation();

const saveData = async () => {
  try {
    await addToCart({
      name: product.name,
      productId: product._id,
      image: product.image,
      quantity: ProductQuantity,
      totalprice: ProductPrice,
      price: product.price,
    }).unwrap();

    toast.success("product added to cart");
    onClose();
    router.push("../../Cart");
  } catch (err) {
    console.error("Error:", err);
    toast.error("product not added to cart");
  }
};
  if (!isOpen) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header  ">
            <h2 className="modal-title w-100 text-center">Confirm Order</h2>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-column justify-content-between align-items-center my-4">
              <h2>{product.name}</h2>
              <h2>{ProductPrice}$</h2>
            </div>
            <div className="modal-buttons d-flex justify-content-center gap-5">
              <button className="btn btn-primary px-4 py3" onClick={saveData}>
                Confirm
              </button>
              <button className="btn btn-secondary px-4 py3" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
