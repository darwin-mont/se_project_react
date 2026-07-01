// components/EditProfileModal/EditProfileModal.jsx
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useRef, useEffect } from "react";

const EditProfileModal = ({ isOpen, onClose, onEditProfile, currentUser }) => {
  const defaultValues = {
    name: currentUser?.name || "",
    avatarURL: currentUser?.avatar || "",
  };

  const validationRules = {
    name: { required: true, minLength: 1, maxLength: 30 },
    avatarURL: { required: true, type: "url" },
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
    setValues,
  } = useFormWithValidation(defaultValues, validationRules);

  const nameRef = useRef(null);
  const avatarURLRef = useRef(null);

  // Update form values when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setValues({
        name: currentUser.name || "",
        avatarURL: currentUser.avatar || "",
      });
    }
  }, [currentUser, setValues]);

  function handleSubmit(evt) {
    evt.preventDefault();
    const { valid, errors: nextErrors } = validateForm();

    if (valid) {
      onEditProfile({ name: values.name, avatar: values.avatarURL });
      resetForm();
      return;
    }

    if (nextErrors.name) {
      nameRef.current?.focus();
      return;
    }
    if (nextErrors.avatarURL) {
      avatarURLRef.current?.focus();
      return;
    }
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <ModalWithForm
      title="Change Profile Data "
      name="edit-profile"
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <label htmlFor="profile-name" className="modal__label">
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
          id="profile-name"
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

      <label htmlFor="profile-avatar" className="modal__label">
        Avatar
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
          id="profile-avatar"
          placeholder="Enter avatar image URL"
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

export default EditProfileModal;
