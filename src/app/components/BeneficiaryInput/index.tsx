import * as React from 'react';
import {Input} from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';

interface IProps {
  onChange?: (ben: string) => void;
  onBlur?: (ben: string) => void;
  onFocus?: () => void;
}

interface IState {
  benID?: string;
}

class BeneficiaryInput extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  private onChange(_, data) {
    this.setState({
      benID: data.value,
    });
    if (!isNullOrUndefined(this.props.onChange)) {
      this.props.onChange(data.value);
    }
  }

  private onBlur() {
    if (!isNullOrUndefined(this.props.onBlur)) {
      this.props.onBlur(this.state.benID);
    }
  }

  public render() {
    return (
      <Input type="text" placeholder="Beneficiary ID" onChange={this.onChange} onBlur={this.onBlur} onFocus={this.props.onFocus} />
    );
  }
}

export {BeneficiaryInput};
