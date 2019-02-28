import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Loader } from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';
import {exportReport, IExportReportResult} from 'apollo/modules/reports';
import {Error} from 'components/Error';
const appConfig = require('../../../../config/main');

interface IProp  {
  data: IExportReportResult;
  match: {
    params: {
      questionSetID: string,
      start: string,
      end: string,
    },
  };
  location: {
    search: string,
    open: boolean,
  };
}

class ExportReportInner extends React.Component<IProp, any> {

  public componentDidUpdate(prevProps: IProp) {
    if (this.props.data.exportReport !== prevProps.data.exportReport && !isNullOrUndefined(this.props.data.exportReport)) {
      window.location.href = appConfig.app.api + this.props.data.exportReport;
    }
  }

  public render() {
    const wrapper = (inner: JSX.Element) => {
      return (
        <Grid container={true} columns={1} id="data">
          <Grid.Column>
            <Helmet>
              <title>Questionnaire Export</title>
            </Helmet>
            {inner}
          </Grid.Column>
        </Grid>
      );
    };
    if (this.props.data.error) {
      return wrapper(<Error text="Exporting failed"/>);
    }
    if (this.props.data.loading) {
      return wrapper(<Loader active={true} inline="centered" />);
    }
    return wrapper(<span>Download started</span>);
  }
}

function getQuestionSetIDFromProps(p: IProp): string {
  return p.match.params.questionSetID;
}

function getStartDateFromProps(p: IProp): string {
  return p.match.params.start;
}

function getEndDateFromProps(p: IProp): string {
  return p.match.params.end;
}

function getTagsFromProps(p: IProp): string[] {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('tags') === false) {
    return [];
  }
  const tags = urlParams.get('tags');
  const parsedTags = JSON.parse(tags);
  return parsedTags;
}

function getOpenFromProps(p: IProp): boolean {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('open') === false) {
    return false;
  }
  const open = urlParams.get('open');
  return JSON.parse(open);
}

function getOrFromProps(p: IProp): boolean {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('or') === false) {
    return false;
  }
  return JSON.parse(urlParams.get('or'));
}

const ExportReport = exportReport(getQuestionSetIDFromProps, getStartDateFromProps, getEndDateFromProps, getTagsFromProps, getOpenFromProps, getOrFromProps)(ExportReportInner);
export { ExportReport };
