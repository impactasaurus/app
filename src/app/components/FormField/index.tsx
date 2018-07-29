import * as React from 'react';
import {Icon, Form} from 'semantic-ui-react';

interface IProps {
  error?: string;
  inputID: string;
  label: string;
}

export class FormField extends React.Component<IProps, any> {
  public render() {
    const {error, inputID, label} = this.props;
    return (
      <Form.Field error={error !== undefined}>
        <label htmlFor={inputID}>{label}</label>
        {this.props.children}
        {error !== undefined && <span className="error validation"><Icon name="exclamation" />{error}</span>}
      </Form.Field>
    );
  }
}
