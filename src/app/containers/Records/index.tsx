import * as React from 'react';
import { Loader } from 'semantic-ui-react';
import {IURLConnector} from 'redux/modules/url';
import {getAllMeetings, IGetAllMeetingsResult} from 'apollo/modules/meetings';
import {RecordList} from 'components/RecordList';
import {Error} from 'components/Error';

interface IProps extends IURLConnector {
  match: {
    params: {
      id: string,
    },
  };
  data?: IGetAllMeetingsResult;
}

class RecordsInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.renderRecords = this.renderRecords.bind(this);
  }

  private renderRecords(): JSX.Element {
    if (this.props.data.error) {
      return (<Error text="Failed to load records"/>);
    }
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    const noCompleteMeetings = !Array.isArray(this.props.data.getMeetings) || this.props.data.getMeetings.length === 0;
    const noIncompleteMeetings = !Array.isArray(this.props.data.getIncompleteMeetings) || this.props.data.getIncompleteMeetings.length === 0;
    if (noCompleteMeetings && noIncompleteMeetings) {
      return (
        <p>No meetings found for beneficiary {this.props.match.params.id}</p>
      );
    }
    return (
      <RecordList meetings={[].concat(...this.props.data.getMeetings, ...this.props.data.getIncompleteMeetings)} />
    );
  }

  public render() {
    if(this.props.match.params.id === undefined) {
      return (<div />);
    }

    return (
      <div id="records">
        {this.renderRecords()}
      </div>
    );
  }
}

const Records = getAllMeetings<IProps>((p) => p.match.params.id)(RecordsInner);
export { Records };
