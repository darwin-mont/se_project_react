import { useState, useEffect, useRef } from "react";
import "./ItemModal.css";

function ItemModal({ activeModal, onClose, card, onDeleteCard }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const yesRef = useRef(null);

  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);
  const confirmDelete = () => {
    setShowConfirm(false);
    onDeleteCard(card);
  };

  // Accessibility: focus Yes when modal opens, restore body scroll
  useEffect(() => {
    if (showConfirm) {
      yesRef.current?.focus();
      // prevent background scrolling while confirm modal is open
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [showConfirm]);

  // close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && showConfirm) closeConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showConfirm]);

  return (
    <div className={`modal ${activeModal === "preview" && "modal_opened"}`}>
      <div className="modal__content modal__content_type_image">
        <button
          onClick={onClose}
          type="button"
          className="modal__close modal__content_type_image"
          aria-label="Close preview"
        />

        {/* top-right removed; delete controls will be shown in the footer caption area */}

        <img
          src={card.imageUrl || card.link}
          alt={card.name}
          className="modal__image"
        />

        {/* custom confirm modal will be used on Delete click */}

        <div className="modal__footer">
          <div className="modal__caption-row">
            <h2 className="modal__caption">{card.name}</h2>
            <div className="modal__caption-actions">
              <button
                onClick={openConfirm}
                type="button"
                className="modal__delete-button"
                aria-label={`Delete ${card?.name || "item"}`}
              >
                Delete Item
              </button>
            </div>
          </div>

          <p className="modal__weather">Weather: {card.weather}</p>
        </div>
        {showConfirm && (
          <div className="confirm-backdrop" onClick={closeConfirm}>
            <div
              className="confirm-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="confirm-title">Confirm delete</h3>
              <p>Are you sure you want to delete "{card?.name}"?</p>
              <p>This Action is irreversible</p>
              <div className="modal__confirm-actions">
                <button
                  ref={yesRef}
                  onClick={confirmDelete}
                  className="modal__confirm-yes"
                >
                  Yes, delete item
                </button>
                <button onClick={closeConfirm} className="modal__confirm-no">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemModal;
