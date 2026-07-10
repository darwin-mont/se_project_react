import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useRef, useEffect } from "react";

const LoginModal = ({ isOpen, onLogin, onClose, onSwitchToRegister }) => {
  const defaultValues = {
    email: "",
    password: "",
  };

  const validationRules = {
    email: { required: true, type: "email" },
    password: { required: true },
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
      onLogin(values);
      resetForm();
      return;
    }

    if (nextErrors.email) {
      emailRef.current?.focus();
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
      title="Sign In"
      name="login"
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      btnText="Log In"
      footerContent={
        <button
          type="button"
          className="modal__switch-button"
          onClick={onSwitchToRegister}
        >
          or SignUp
        </button>
      }
    >
      <label htmlFor="login-email" className="modal__label">
        Email
        <input
          type="email"
          name="email"
          ref={emailRef}
          autoComplete="email"
          aria-invalid={shouldShowError("email")}
          aria-describedby="login-error-email"
          className={`modal__input ${
            shouldShowError("email") ? "modal__input_invalid" : ""
          }`}
          id="login-email"
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
      <label htmlFor="login-password" className="modal__label">
        Password
        <input
          name="password"
          type="password"
          ref={passwordRef}
          autoComplete="password"
          aria-invalid={shouldShowError("password")}
          aria-describedby="login-error-password"
          className={`modal__input ${
            shouldShowError("password") ? "modal__input_invalid" : ""
          }`}
          id="login-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span
          id="login-error-password"
          role="alert"
          className={`modal__error ${
            shouldShowError("password") ? "modal__error_visible" : ""
          }`}
        >
          {isOpen && errors.password}
        </span>
      </label>
    </ModalWithForm>
  );
};

export default LoginModal;
