import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Loader } from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';
import {exportMeetings, IExportMeetingsResult} from 'apollo/modules/meetings';
import {Error} from 'components/Error';
const appConfig = require('../../../../config/main');

interface IProps  {
  data: IExportMeetingsResult;
  match: {
    params: {
      id: string,
    },
  };
}

class ExportQuestionnaireInner extends React.Component<IProps, any> {

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.data.exportMeetings !== prevProps.data.exportMeetings && !isNullOrUndefined(this.props.data.exportMeetings)) {
      window.location.href = appConfig.app.api + this.props.data.exportMeetings;
    }
  }

  public render() {
    const wrapper = (inner: JSX.Element) => (
      <Grid container={true} columns={1} id="data">
        <Grid.Column>
          <Helmet>
            <title>Questionnaire Export</title>
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

const ExportQuestionnaire = exportMeetings((p: IProps) => p.match.params.id)(ExportQuestionnaireInner);
export { ExportQuestionnaire };
