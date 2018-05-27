import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Loader } from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';
import {exportMeetings, IExportMeetingsResult} from '../../apollo/modules/meetings';
const appConfig = require('../../../../config/main');

interface IProps  {
  data: IExportMeetingsResult;
  params: {
    id: string,
  };
}

class ExportQuestionnaireInner extends React.Component<IProps, any> {

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.data.exportMeetings !== prevProps.data.exportMeetings && !isNullOrUndefined(this.props.data.exportMeetings)) {
      window.location.href = appConfig.app.api + this.props.data.exportMeetings;
    }
  }

  public render() {
    let inner = (<Loader active={true} inline="centered" />);
    if (!isNullOrUndefined(this.props.data.exportMeetings) && !this.props.data.loading) {
      inner = (<span>Download started</span>);
    }
    return (
      <Grid container columns={1} id="data">
        <Grid.Column>
          <Helmet>
            <title>Questionnaire Export</title>
          </Helmet>
          {inner}
        </Grid.Column>
      </Grid>
    );
  }
}

const ExportQuestionnaire = exportMeetings((p: IProps) => p.params.id)(ExportQuestionnaireInner);
export { ExportQuestionnaire }
