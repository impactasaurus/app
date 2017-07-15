import * as React from 'react';
import {MeetingView} from 'components/MeetingView';

interface IProps {
  params: {
      id: string,
  };
};

class Review extends React.Component<IProps, any> {
  public render() {
    let inner: JSX.Element;
    if(this.props.params.id === undefined) {
      inner = (<div />);
    } else {
      inner = (<MeetingView beneficiaryID={this.props.params.id} />);
    }
    return (
      <div id="review">
        {inner}
      </div>
    );
  }
}

export { Review }
