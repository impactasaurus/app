import * as React from 'react';
import {Icon, Form} from 'semantic-ui-react';

interface IProps {
  error?: string;
  inputID: string;
  label: string;
  touched: boolean;
  required?: boolean;
}

export class FormField extends React.Component<IProps, any> {
  public render() {
    const {error, inputID, label, touched, required} = this.props;
    const errored = touched && error !== undefined;
    return (
      <Form.Field error={errored} required={required}>
        <label htmlFor={inputID}>{label}</label>
        {this.props.children}
        {errored && <span className="error validation"><Icon name="exclamation" />{error}</span>}
      </Form.Field>
    );
  }
}
