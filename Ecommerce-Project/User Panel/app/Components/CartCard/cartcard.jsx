"use client";
import "./cartcard.css";
import Image from "next/image";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useDeleteCartItemMutation, useUpdateCartItemMutation } from "../../Features/CartApi";

export default function CartCard({ cartItem }) {
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const handleDelete = () => deleteCartItem(cartItem._id);

  const handleQuantityChange = (newQty) => {
    if (newQty < 1 || newQty > cartItem.productQuantity) return;
    updateCartItem({
      id: cartItem._id,
      quantity: newQty,
      totalprice: newQty * cartItem.price,
    });
  };

  return (
    <tr>
      <td>
        <Image
          src={cartItem.product.image || "/uploads/placeholder.jpg"}
          alt="product"
          width={70}
          height={70}
          className="cart-img"
        />
      </td>
      <td className="fw-semibold">{cartItem.product.name}</td>
      <td>
        <div className="quantity-box">
          <button className="qty-btn" onClick={() => handleQuantityChange(cartItem.quantity - 1)}>
            <FaMinus
              style={{
                cursor: cartItem.quantity === 1 ? "not-allowed" : "pointer",
                opacity: cartItem.quantity === 1 ? 0.5 : 1,
              }}
            />
          </button>
          <span className="qty-number">{cartItem.quantity}</span>
          <button className="qty-btn" onClick={() => handleQuantityChange(cartItem.quantity + 1)}>
            <FaPlus
              style={{
                cursor: cartItem.quantity === cartItem.productQuantity ? "not-allowed" : "pointer",
                opacity: cartItem.quantity === cartItem.productQuantity ? 0.5 : 1,
              }}
            />
          </button>
        </div>
      </td>
      <td>{cartItem.price}$</td>
      <td className="fw-bold text-success">{cartItem.totalprice}$</td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}