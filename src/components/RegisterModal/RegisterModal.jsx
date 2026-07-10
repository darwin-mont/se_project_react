import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useRef, useEffect } from "react";

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

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

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

  const shouldShowError = (fieldName) => {
    return isOpen && (touched[fieldName] || isSubmitted) && errors[fieldName];
  };

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
          aria-invalid={shouldShowError("email")}
          aria-describedby="login-error-email"
          className={`modal__input ${
            shouldShowError("email") ? "moda__input_invalid" : ""
          }`}
          id="register-email"
          placeholder="Enter your email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span
          id="login-error-email"
          role="alert"
          className={`modal__error ${
            shouldShowError("email") ? "modal__error_visible" : ""
          }`}
        >
          {isOpen && errors.email}
        </span>
      </label>
      <label htmlFor="register-password" className="modal__label">
        Password
        <input
          name="password"
          type="password"
          ref={passwordRef}
          autoComplete="new-password"
          aria-invalid={shouldShowError("password")}
          aria-describedby="register-error-password"
          className={`modal__input ${
            shouldShowError("password") ? "modal__input_invalid" : ""
          }`}
          id="register-password"
          placeholder="Create a password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span
          id="register-error-password"
          role="alert"
          className={`modal__error ${
            shouldShowError("password") ? "modal__error_visible" : ""
          }`}
        >
          {isOpen && errors.password}
        </span>
      </label>
      <label htmlFor="register-name" className="modal__label">
        Name
        <input
          type="text"
          name="name"
          ref={nameRef}
          autoComplete="name"
          aria-invalid={shouldShowError("name")}
          aria-describedby="register-error-name"
          className={`modal__input ${
            shouldShowError("name") ? "modal__input_invalid" : ""
          }`}
          id="register-name"
          placeholder="Enter your name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span
          id="register-error-name"
          role="alert"
          className={`modal__error ${
            shouldShowError("name") ? "modal__error_visible" : ""
          }`}
        >
          {isOpen && errors.name}
        </span>
      </label>
      <label htmlFor="avatarURL" className="modal__label">
        Avatar URL
        <input
          name="avatarURL"
          type="url"
          ref={avatarURLRef}
          autoComplete="off"
          aria-invalid={shouldShowError("avatarURL")}
          aria-describedby="register-error-avatarURL"
          className={`modal__input ${
            shouldShowError("avatarURL") ? "modal__input_invalid" : ""
          }`}
          id="avatarURL"
          placeholder="Image URL"
          value={values.avatarURL}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span
          id="register-error-avatarURL"
          role="alert"
          className={`modal__error ${
            shouldShowError("avatarURL") ? "modal__error_visible" : ""
          }`}
        >
          {isOpen && errors.avatarURL}
        </span>
      </label>
    </ModalWithForm>
  );
};

export default RegisterModal;
