import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Loader } from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';
import {exportBenMeetings, IExportBenMeetingsResult} from 'apollo/modules/meetings';
import {Error} from 'components/Error';
const appConfig = require('../../../../config/main');

interface IProps  {
  data: IExportBenMeetingsResult;
  match: {
    params: {
      id: string,
      qid: string,
    },
  };
}

class ExportBenRecordsInner extends React.Component<IProps, any> {

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.data.exportBenMeetings !== prevProps.data.exportBenMeetings && !isNullOrUndefined(this.props.data.exportBenMeetings)) {
      window.location.href = appConfig.app.api + this.props.data.exportBenMeetings;
    }
  }

  public render() {
    const wrapper = (inner: JSX.Element) => (
      <Grid container={true} columns={1} id="data">
        <Grid.Column>
          <Helmet>
            <title>Beneficiary Record Export</title>
          </Helmet>
          {inner}
        </Grid.Column>
      </Grid>
    );
    if (this.props.data.error) {
      return wrapper(<Error text="Export failed" />);
    }
    if (this.props.data.loading) {
      return wrapper(<Loader active={true} inline="centered" />);
    }
    return wrapper(<span>Download started</span>);
  }
}

const ExportBenRecords = exportBenMeetings((p: IProps) => p.match.params.qid, (p: IProps) => p.match.params.id)(ExportBenRecordsInner);
export { ExportBenRecords };
