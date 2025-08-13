import "./ModalWithForm.css";

function ModalWithForm({ children, btnText, title, activeModal, onClose }) {
  return (
    <div className={`modal ${activeModal ? "modal_opened" : ""}`}>
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <button
          onClick={onClose}
          type="button"
          className="modal__close"
        ></button>
        <form className="modal__form">
          {children}
          <button type="submit" className="modal__submit">
            {btnText}
          </button>
        </form>
      </div>
    </div>
  );
}
export default ModalWithForm;
