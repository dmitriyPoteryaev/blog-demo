import type { Rule } from "antd/es/form";

export function confirmPasswordValidator(
  passwordField: string,
  errorMessage = "Пароли не совпадают"
): Rule {
  return ({ getFieldValue }) => ({
    validator(_, value) {
      const password = getFieldValue(passwordField);

      if (!value || value === password) {
        return Promise.resolve();
      }

      return Promise.reject(new Error(errorMessage));
    },
  });
}
