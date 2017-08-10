import * as React from 'react';
import {Input as SemInput, InputProps} from 'semantic-ui-react';

interface IProps extends InputProps {
  autofocus?: boolean;
}

class Input extends React.Component<IProps, any> {

  private input: HTMLInputElement;

  constructor(props) {
    super(props);
    this.handleRef = this.handleRef.bind(this);
  }

  public componentDidMount() {
    if (this.props.autofocus) {
      this.input.focus();
    }
  }

  private handleRef(c) {
    this.input = c;
  }

  public render() {
    return (
      <SemInput {...this.props} ref={this.handleRef}>
        {this.props.children}
      </SemInput>
    );
  }
}

export {Input};
