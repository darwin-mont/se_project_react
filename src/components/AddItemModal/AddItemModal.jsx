import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useRef } from "react";

const AddItemModal = ({ isOpen, onAddItem, onClose }) => {
  const defaultValues = {
    name: "",
    link: "",
    weatherType: "",
  };

  const validationRules = {
    name: { required: true, minLength: 1, maxLength: 30 },
    link: { required: true, type: "url" },
    weatherType: { required: true },
  };

  const {
    values,
    handleChange,
    errors,
    isValid,
    resetForm,
    validateForm,
    isSubmitted,
    touched,
    handleBlur,
  } = useFormWithValidation(defaultValues, validationRules);

  const nameRef = useRef(null);
  const linkRef = useRef(null);
  const weatherRef = useRef(null);

  function handleSubmit(evt) {
    evt.preventDefault();
    const { valid, errors: nextErrors } = validateForm();
    if (valid) {
      onAddItem(values);
      resetForm();
      return;
    }

    // focus the first invalid field in order: name, link, weatherType
    if (nextErrors.name) {
      nameRef.current?.focus();
      return;
    }
    if (nextErrors.link) {
      linkRef.current?.focus();
      return;
    }
    if (nextErrors.weatherType) {
      weatherRef.current?.focus();
      return;
    }
  }
  function handleClose() {
    // clear form state when closing so errors don't persist
    resetForm();
    onClose();
  }
  return (
    <ModalWithForm
      title="New Garment"
      name="new-card"
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <label htmlFor="clothing-name" className="modal__label">
        Name
        <input
          type="text"
          name="name"
          ref={nameRef}
          autoComplete="off"
          aria-invalid={isSubmitted && !!errors.name}
          aria-describedby="error-name"
          className={`modal__input ${
            (touched.name || isSubmitted) && errors.name
              ? "modal__input_invalid"
              : ""
          }`}
          id="clothing-name"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span
          id="error-name"
          role="alert"
          className={`modal__error ${
            (touched.name || isSubmitted) && errors.name
              ? "modal__error_visible"
              : ""
          }`}
        >
          {errors.name}
        </span>
      </label>
      <label htmlFor="imageUrl" className="modal__label">
        Image
        <input
          name="link"
          type="text"
          ref={linkRef}
          autoComplete="off"
          aria-invalid={isSubmitted && !!errors.link}
          aria-describedby="error-link"
          className={`modal__input ${
            (touched.link || isSubmitted) && errors.link
              ? "modal__input_invalid"
              : ""
          }`}
          id="imageUrl"
          placeholder="Image URL"
          value={values.link}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span
          id="error-link"
          role="alert"
          className={`modal__error ${
            (touched.link || isSubmitted) && errors.link
              ? "modal__error_visible"
              : ""
          }`}
        >
          {errors.link}
        </span>
      </label>
      <fieldset
        ref={weatherRef}
        className={`modal__radio-btns ${
          isSubmitted && errors.weatherType ? "modal__radio-btns_invalid" : ""
        }`}
        aria-describedby="error-weatherType"
        tabIndex={-1}
      >
        <legend className="modal__legend"> Select the weather type:</legend>
        <label htmlFor="hot">
          <input
            id="hot"
            type="radio"
            className="modal__radio-input"
            name="weatherType"
            autoComplete="off"
            value="hot"
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={
              (touched.weatherType || isSubmitted) && !!errors.weatherType
            }
            aria-describedby={
              (touched.weatherType || isSubmitted) && errors.weatherType
                ? "error-weatherType"
                : undefined
            }
            checked={values.weatherType === "hot"}
          />{" "}
          Hot
        </label>
        <label htmlFor="warm">
          <input
            id="warm"
            type="radio"
            className="modal__radio-input"
            name="weatherType"
            autoComplete="off"
            value="warm"
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={
              (touched.weatherType || isSubmitted) && !!errors.weatherType
            }
            aria-describedby={
              (touched.weatherType || isSubmitted) && errors.weatherType
                ? "error-weatherType"
                : undefined
            }
            checked={values.weatherType === "warm"}
          />{" "}
          Warm
        </label>
        <label htmlFor="cold">
          <input
            id="cold"
            type="radio"
            className="modal__radio-input"
            name="weatherType"
            autoComplete="off"
            value="cold"
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={
              (touched.weatherType || isSubmitted) && !!errors.weatherType
            }
            aria-describedby={
              (touched.weatherType || isSubmitted) && errors.weatherType
                ? "error-weatherType"
                : undefined
            }
            checked={values.weatherType === "cold"}
          />{" "}
          Cold
        </label>
        <span
          id="error-weatherType"
          role="alert"
          className={`modal__error ${
            (touched.weatherType || isSubmitted) && errors.weatherType
              ? "modal__error_visible"
              : ""
          }`}
        >
          {errors.weatherType}
        </span>
      </fieldset>
    </ModalWithForm>
  );
};

export default AddItemModal;
