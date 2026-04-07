"use client";
import "./ProductConfirmModal.css";

export default function ProductConfirmModalNew({ isOpen, onClose, data = [] }) {
  if (!isOpen) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h2 className="modal-title w-100 text-center">Product Rating</h2>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
      <div
  className="modal-body"
  style={{ maxHeight: "350px", overflowY: "auto" }}
>
  {data.filter(item => item?.rating >= 1).length === 0 ? (
    <p className="text-center">No reviews yet.</p>
  ) : (
    <div className="list-group">
      {data
        .filter(item => item?.rating >= 1)
        .map((item, index) => {
          const rating = item?.rating || 0;
          const review = item?.review || "No review";
          const updatedAt = item?.updatedAt;

          return (
            <div key={index} className="list-group-item mb-3 shadow-sm">
              {/* Rating stars */}
              <div className="mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`bi ${
                      rating >= star ? "bi-star-fill" : "bi-star"
                    } text-warning me-1`}
                  ></i>
                ))}
              </div>

              {/* Review text */}
              <p className="mb-1">{review}</p>

              {/* Dates */}
              { updatedAt && (
                <small className="text-muted">
               {new Date(updatedAt).toLocaleDateString()}
                </small>
              )}
            </div>
          );
        })}
    </div>
  )}
</div>

          {/* Footer */}
          <div className="modal-footer d-flex justify-content-center gap-3">
            <button className="btn btn-secondary px-4" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}