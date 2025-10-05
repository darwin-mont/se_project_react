import "./ItemModal.css";

function ItemModal({ activeModal, onClose, card, onDeleteCard }) {
  return (
    <div className={`modal ${activeModal === "preview" && "modal_opened"}`}>
      <div className="modal__content modal__content_type_image">
        <button
          onClick={() => onDeleteCard(card)}
          type="button"
          className="modal__delete-button modal__content_type_image"
        />
        Delete Item
        <button
          onClick={onClose}
          type="button"
          className="modal__close modal__content_type_image"
        />
        <img src={card.link} alt={card.name} className="modal__image" />
        <div className="modal__footer">
          <h2 className="modal__caption">{card.name}</h2>
          <p className="modal__weather">Weather: {card.weather}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
