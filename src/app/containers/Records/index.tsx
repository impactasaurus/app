import * as React from 'react';
import { Loader, Message } from 'semantic-ui-react';
import {IURLConnector} from 'redux/modules/url';
import {getIncompleteMeetings, getMeetings, IIncompleteMeetingsResult, IMeetingResult} from 'apollo/modules/meetings';
import {RecordList} from 'components/RecordList';

interface IProps extends IURLConnector {
  params: {
    id: string,
  };
  data?: IMeetingResult;
  incompleteMeetings?: IIncompleteMeetingsResult;
}

class RecordsInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.renderRecords = this.renderRecords.bind(this);
  }

  private renderRecords(): JSX.Element {
    if (this.props.data.loading || this.props.incompleteMeetings.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    if (this.props.data.error !== undefined || this.props.incompleteMeetings.error !== undefined) {
      return (
        <Message error={true}>
          <Message.Header>Error</Message.Header>
          <div>Failed to load records</div>
        </Message>
      );
    }
    const noCompleteMeetings = !Array.isArray(this.props.data.getMeetings) || this.props.data.getMeetings.length === 0;
    const noIncompleteMeetings = !Array.isArray(this.props.incompleteMeetings.getIncompleteMeetings) || this.props.incompleteMeetings.getIncompleteMeetings.length === 0;
    if (noCompleteMeetings && noIncompleteMeetings) {
      return (
        <p>No meetings found for beneficiary {this.props.params.id}</p>
      );
    }
    return (
      <RecordList meetings={[].concat(...this.props.data.getMeetings, ...this.props.incompleteMeetings.getIncompleteMeetings)} />
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

const Records = getIncompleteMeetings<IProps>((p) => p.params.id, 'incompleteMeetings')(getMeetings<IProps>((p) => p.params.id)(RecordsInner));
export { Records }
