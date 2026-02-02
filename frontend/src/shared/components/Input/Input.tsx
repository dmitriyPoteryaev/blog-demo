import React from "react";
import { Input } from "antd";
import type { InputProps } from "antd";
import type { PasswordProps } from "antd/es/input/Password";
import type { TextAreaProps } from "antd/es/input/TextArea";

export type FormInputProps = InputProps;
export const FormInput: React.FC<FormInputProps> = (props) => {
  return <Input {...props} />;
};

export type FormPasswordProps = PasswordProps;
export const FormPassword: React.FC<FormPasswordProps> = (props) => {
  return <Input.Password {...props} />;
};

export type FormTextAreaProps = TextAreaProps;
export const FormTextArea: React.FC<FormTextAreaProps> = (props) => {
  return <Input.TextArea {...props} />;
};
