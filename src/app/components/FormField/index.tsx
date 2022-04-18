import React from "react";
import { Icon, Form, SemanticWIDTHS } from "semantic-ui-react";
import "./style.less";

interface IProps {
  error?: string;
  inputID: string;
  label: string | JSX.Element;
  touched?: boolean;
  required?: boolean;
  width?: SemanticWIDTHS;
  description?: string;
  id?: string;
  hideErrorMessage?: boolean;
  children?: JSX.Element | JSX.Element[];
}

export const FormField = (p: IProps): JSX.Element => {
  const errored = p.touched && p.error !== undefined;
  return (
    <Form.Field
      error={errored}
      required={p.required}
      width={p.width}
      className="form-field"
      id={p.id}
    >
      <label htmlFor={p.inputID}>{p.label}</label>
      {p.description && <span className="description">{p.description}</span>}
      {p.children}
      {errored && p.hideErrorMessage !== true && (
        <span className="error validation">
          <Icon name="exclamation" />
          {p.error}
        </span>
      )}
    </Form.Field>
  );
};
