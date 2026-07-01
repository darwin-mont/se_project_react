import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useRef } from "react";

const RegisterModal = ({ isOpen, onRegister, onClose, onSwitchToLogin }) => {
  const defaultValues = {
    name: "",
    avatarURL: "",
    email: "",
    password: "",
  };

  const validationRules = {
    name: { required: true, minLength: 1, maxLength: 30 },
    avatarURL: { required: true, type: "url" },
    email: { required: true, type: "email" },
    password: { required: true, minLength: 6, maxLength: 30 },
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
  const avatarURLRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  function handleSubmit(evt) {
    evt.preventDefault();
    const { valid, errors: nextErrors } = validateForm();

    if (valid) {
      onRegister(values);
      resetForm();
      return;
    }

    // focus the first invalid field in order: name, email, avatar, password
    if (nextErrors.name) {
      nameRef.current?.focus();
      return;
    }
    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (nextErrors.avatarURL) {
      avatarURLRef.current?.focus();
      return;
    }
    if (nextErrors.password) {
      passwordRef.current?.focus();
      return;
    }
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <ModalWithForm
      title="Sign Up"
      name="register"
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      btnText="Sign Up"
      footerContent={
        <button
          type="button"
          className="modal__switch-button"
          onClick={onSwitchToLogin}
        >
          orLogIn
        </button>
      }
    >
      <label htmlFor="register-email" className="modal__label">
        Email
        <input
          type="email"
          name="email"
          ref={emailRef}
          autoComplete="email"
          aria-invalid={isSubmitted && !!errors.email}
          aria-describedby="error-email"
          className={`modal__input ${
            (touched.email || isSubmitted) && errors.email
              ? "modal__input_invalid"
              : ""
          }`}
          id="register-email"
          placeholder="Enter your email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span
          id="error-email"
          role="alert"
          className={`modal__error ${
            (touched.email || isSubmitted) && errors.email
              ? "modal__error_visible"
              : ""
          }`}
        >
          {errors.email}
        </span>
      </label>
      <label htmlFor="register-password" className="modal__label">
        Password
        <input
          name="password"
          type="password"
          ref={passwordRef}
          autoComplete="new-password"
          aria-invalid={isSubmitted && !!errors.password}
          aria-describedby="error-password"
          className={`modal__input ${
            (touched.password || isSubmitted) && errors.password
              ? "modal__input_invalid"
              : ""
          }`}
          id="register-password"
          placeholder="Create a password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span
          id="error-password"
          role="alert"
          className={`modal__error ${
            (touched.password || isSubmitted) && errors.password
              ? "modal__error_visible"
              : ""
          }`}
        >
          {errors.password}
        </span>
      </label>
      <label htmlFor="register-name" className="modal__label">
        Name
        <input
          type="text"
          name="name"
          ref={nameRef}
          autoComplete="name"
          aria-invalid={isSubmitted && !!errors.name}
          aria-describedby="error-name"
          className={`modal__input ${
            (touched.name || isSubmitted) && errors.name
              ? "modal__input_invalid"
              : ""
          }`}
          id="register-name"
          placeholder="Enter your name"
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
      <label htmlFor="avatarURL" className="modal__label">
        Avatar URL
        <input
          name="avatarURL"
          type="url"
          ref={avatarURLRef}
          autoComplete="off"
          aria-invalid={isSubmitted && !!errors.avatarURL}
          aria-describedby="error-avatarURL"
          className={`modal__input ${
            (touched.avatarURL || isSubmitted) && errors.avatarURL
              ? "modal__input_invalid"
              : ""
          }`}
          id="avatarURL"
          placeholder="Image URL"
          value={values.avatarURL}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span
          id="error-avatarURL"
          role="alert"
          className={`modal__error ${
            (touched.avatarURL || isSubmitted) && errors.avatarURL
              ? "modal__error_visible"
              : ""
          }`}
        >
          {errors.avatarURL}
        </span>
      </label>
    </ModalWithForm>
  );
};

export default RegisterModal;
