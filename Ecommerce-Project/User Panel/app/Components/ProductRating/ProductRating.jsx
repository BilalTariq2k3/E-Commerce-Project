"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useSubmitRatingMutation } from "../../Features/OrderApi";

export default function ProductRating({ isOpen, onClose, data, refresh }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const { id } = useParams(); // orderId
  const [submitRating, { isLoading }] = useSubmitRatingMutation();

  useEffect(() => {
    if (isOpen && data) {
      setReview(data.review || "");
      setRating(data.rating || 0);
    }
  }, [isOpen, data]);

  const handleSubmit = async () => {
    const trimmedReview = review.trim();

    if (rating === 0) {
      toast.error("Please select rating");
      return;
    }
    if (!trimmedReview) {
      toast.error("Please write a review");
      return;
    }

    try {
      await submitRating({
        orderId: id,
        productId: data.productId._id,
        rating,
        review: trimmedReview,
      }).unwrap();

      toast.success("Review submitted");
      refresh(); // refresh order list if needed
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    }
  };

  const handleClose = () => {
    setRating(0);
    setReview("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title w-100 text-center">Rating</h5>
            <button className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="modal-body text-center">
            <h3>{data.productId.name}</h3>

            <Image
              src={data.productId.image}
              alt={data.productId.name}
              width={200}
              height={100}
              className="img-fluid rounded mb-3"
            />

            <div className="mb-3">
              <label className="form-label">Add Review</label>
              <input
                type="text"
                className="form-control"
                placeholder="Write review"
                value={review}
                onChange={(e) =>
                  setReview(e.target.value.replace(/\s{2,}/g, " "))
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Rating</label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`bi ${
                      rating >= star ? "bi-star-fill" : "bi-star"
                    } fs-3 text-warning me-2`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setRating(star)}
                  ></i>
                ))}
              </div>
            </div>

            <button
              className="btn btn-success w-100"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit Rating"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}