import { useState } from "react";

// validationRules example:
// { name: { required: true, minLength: 1, maxLength: 30 }, link: { required: true, type: 'url' } }
export function useFormWithValidation(defaultValues, validationRules = {}) {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState({});

  const validators = {
    required: (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string") return value.trim() !== "";
      return true;
    },
    minLength: (value, len) =>
      typeof value === "string" && value.trim().length >= len,
    maxLength: (value, len) =>
      typeof value === "string" && value.trim().length <= len,
    url: (value) => {
      if (!value) return false;
      try {
        // allow plain urls only
        new URL(value);
        return true;
      } catch (e) {
        return false;
      }
    },
  };

  function getErrorMessage(name, value, rules = {}) {
    if (rules.required && !validators.required(value))
      return "This field is required.";
    if (rules.minLength && !validators.minLength(value, rules.minLength))
      return `Must be at least ${rules.minLength} characters.`;
    if (rules.maxLength && !validators.maxLength(value, rules.maxLength))
      return `Must be at most ${rules.maxLength} characters.`;
    if (rules.type === "url" && !validators.url(value))
      return "Please enter a valid URL.";
    return "";
  }

  function validateField(name, value) {
    const rules = validationRules[name];
    if (!rules) return "";
    return getErrorMessage(name, value, rules);
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);

    // mark field as touched so the UI can show messages
    setTouched((prev) => ({ ...prev, [name]: true }));

    // validate the field immediately so messages update while user types
    const fieldError = validateField(name, value);
    const nextErrors = { ...errors, [name]: fieldError };
    setErrors(nextErrors);
    setIsValid(Object.values(nextErrors).every((e) => !e));
  }

  function handleBlur(evt) {
    const { name } = evt.target;
    if (!name) return;
    setTouched((prev) => ({ ...prev, [name]: true }));
    // validate on blur as well
    const fieldError = validateField(name, values[name]);
    const nextErrors = { ...errors, [name]: fieldError };
    setErrors(nextErrors);
    setIsValid(Object.values(nextErrors).every((e) => !e));
  }

  function validateForm() {
    setIsSubmitted(true);
    const nextErrors = {};
    Object.keys(validationRules).forEach((name) => {
      const value = values[name];
      nextErrors[name] = validateField(name, value);
    });
    setErrors(nextErrors);
    const valid = Object.values(nextErrors).every((e) => !e);
    setIsValid(valid);
    return { valid, errors: nextErrors };
  }

  function resetForm() {
    setValues(defaultValues);
    setErrors({});
    setIsValid(false);
    setIsSubmitted(false);
    setTouched({});
  }

  return {
    values,
    setValues,
    handleChange,
    handleBlur,
    errors,
    isValid,
    resetForm,
    validateForm,
    isSubmitted,
    touched,
  };
}
