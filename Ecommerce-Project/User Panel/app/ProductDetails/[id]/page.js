"use client";
import { toast } from "react-toastify";

import "../ProductDetails.css";
import DashboardLayout from "../../Components/DashboardLayout/DashboardLayout";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import ProductConfirmModal from "../../Components/ProductConfirmModal/ProductConfirmModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import ProductConfirmModalNew from "../../Components/ProductConfirmModal/ProductConfirmModal1";
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalNew, setModalNew] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [productRating, setProductRating] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loader state

  const totalPrice = product ? product.price * quantity : 0;

  const totalRatings = productRating.reduce(
    (sum, item) => sum + (item.rating || 0),
    0,
  );
  const averageRating = productRating.length
    ? (totalRatings / productRating.length).toFixed(1)
    : 0;

  useEffect(() => {
    if (!id) return;

    const fetchProductData = async () => {
      try {
        setLoading(true); // show loader

        // Fetch product
        const productRes = await axios.get(`/api/ProductDetails/${id}`);
        setProduct(productRes.data);
        setQuantity(productRes.data.quantity === 0 ? 0 : 1);

        // Fetch ratings
        const ratingRes = await axios.get(`/api/ProductAllRating/${id}`);
        setProductRating(ratingRes.data.ratingsAndReviews || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false); // hide loader
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <p>Product not found</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="product-container">
        <div className="product-image">
          <Image
            src={product.image}
            alt={product.name}
            width={550}
            height={350}
          />
        </div>

        <div className="product-details">
          <h1>
            {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
          </h1>
          <p>{product.description}</p>
          <h2>{product.price}$</h2>

        <p className="quantity d-flex align-items-center gap-2">
  <FontAwesomeIcon
    icon={faCircleMinus}
    style={{ cursor: quantity === 1 ? "not-allowed" : "pointer" }}
    onClick={() =>
      setQuantity((prev) =>
        Math.max(prev - 1, product.quantity === 0 ? 0 : 1)
      )
    }
  />

  <span>{quantity}</span>

  <FontAwesomeIcon
    icon={faCirclePlus}
    style={{
      cursor: quantity === product.quantity ? "not-allowed" : "pointer",
    }}
    onClick={() =>
      setQuantity((prev) => Math.min(prev + 1, product.quantity))
    }
  />

  <span
    style={{
      marginLeft: "10px",
      fontSize: "1rem",
      fontWeight: "normal",
    }}
  >
    Rating: {averageRating} / 5
  </span>

  {/* Right corner button */}
  <button
 className="btn btn-outline-primary btn-sm ms-auto"
    onClick={() => setModalNew(true)}
  >
    View reviews
  </button>
</p>

          <button
            className="add-to-cart"
            onClick={() => {
              if (product.quantity === 0) {
                toast.error("Item is out of stock");
                return;
              }
              setModal(true);
            }}
          >
            Add to Cart
          </button>

         
        </div>
      </div>

      {/* <ReviewModal isOpen={true} onClose={() => setReviewModal(false)} /> */}

      <ProductConfirmModal
        isOpen={modal}
        onClose={() => setModal(false)}
        product={product}
        ProductPrice={totalPrice}
        ProductQuantity={quantity}
      />

      <ProductConfirmModalNew
        isOpen={modalNew}
        onClose={() => setModalNew(false)}
        data={productRating}
      />
    </DashboardLayout>
  );
}
