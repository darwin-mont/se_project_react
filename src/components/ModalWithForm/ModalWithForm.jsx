import "./ModalWithForm.css";

function ModalWithForm({
  title,
  name,
  btnText = "Save",
  isOpen,
  onClose,
  children,
  onSubmit,
  footerContent, //new prop for additional buttons/links
}) {
  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <button onClick={onClose} type="button" className="modal__close" />
        <form onSubmit={onSubmit} className="modal__form">
          {children}
          <div className="modal__actions">
            <button type="submit" className="modal__submit">
              {btnText}
            </button>
            {footerContent}
          </div>
        </form>
      </div>
    </div>
  );
}
export default ModalWithForm;
