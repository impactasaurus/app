import * as React from 'react';
import {Icon, Form, SemanticWIDTHS} from 'semantic-ui-react';
import './style.less';

interface IProps {
  error?: string;
  inputID: string;
  label: string|JSX.Element;
  touched: boolean;
  required?: boolean;
  width?: SemanticWIDTHS;
  description?: string;
}

export class FormField extends React.Component<IProps, any> {
  public render() {
    const {error, inputID, label, touched, required, width, description} = this.props;
    const errored = touched && error !== undefined;
    return (
      <Form.Field error={errored} required={required} width={width} className="form-field">
        <label htmlFor={inputID}>{label}</label>
        {description && <span className="description">{description}</span>}
        {this.props.children}
        {errored && <span className="error validation"><Icon name="exclamation" />{error}</span>}
      </Form.Field>
    );
  }
}
