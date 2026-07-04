import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useRef } from "react";

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

  function handleSubmit(evt) {
    evt.preventDefault();
    const { valid, errors: nextErrors } = validateForm();
    if (valid) {
      onLogin(values);
      resetForm();
      return;
    }

    // focus the first invalid field in order: email, password
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
          aria-invalid={isSubmitted && !!errors.email}
          aria-describedby="login-error-email"
          className={`modal__input ${
            (touched.email || isSubmitted) && errors.email
              ? "modal__input_invalid"
              : ""
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
            (touched.email || isSubmitted) && errors.email
              ? "modal__error_visible"
              : ""
          }`}
        >
          {errors.email}
        </span>
      </label>
      <label htmlFor="login-password" className="modal__label">
        Password
        <input
          name="password"
          type="password"
          ref={passwordRef}
          autoComplete="password"
          aria-invalid={isSubmitted && !!errors.password}
          aria-describedby="login-error-password"
          className={`modal__input ${
            (touched.password || isSubmitted) && errors.password
              ? "modal__input_invalid"
              : ""
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
            (touched.password || isSubmitted) && errors.password
              ? "modal__error_visible"
              : ""
          }`}
        >
          {errors.password}
        </span>
      </label>
    </ModalWithForm>
  );
};

export default LoginModal;
