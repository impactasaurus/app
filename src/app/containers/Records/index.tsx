import * as React from 'react';
import { Loader, Message } from 'semantic-ui-react';
import {IURLConnector} from 'redux/modules/url';
import {getAllMeetings, IGetAllMeetingsResult} from 'apollo/modules/meetings';
import {RecordList} from 'components/RecordList';

interface IProps extends IURLConnector {
  params: {
    id: string,
  };
  data?: IGetAllMeetingsResult;
}

class RecordsInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.renderRecords = this.renderRecords.bind(this);
  }

  private renderRecords(): JSX.Element {
    if (this.props.data.error !== undefined) {
      return (
        <Message error={true}>
          <Message.Header>Error</Message.Header>
          <div>Failed to load records</div>
        </Message>
      );
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
        <p>No meetings found for beneficiary {this.props.params.id}</p>
      );
    }
    return (
      <RecordList meetings={[].concat(...this.props.data.getMeetings, ...this.props.data.getIncompleteMeetings)} />
    );
  }

  public render() {
    if(this.props.params.id === undefined) {
      return (<div />);
    }

    return (
      <div id="records">
        {this.renderRecords()}
      </div>
    );
  }
}

const Records = getAllMeetings<IProps>((p) => p.params.id)(RecordsInner);
export { Records };
