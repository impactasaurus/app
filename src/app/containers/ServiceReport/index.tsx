import * as React from 'react';
import 'url-search-params-polyfill';
import { Grid, Loader } from 'semantic-ui-react';
import {getJOCServiceReport, IReportResult} from 'apollo/modules/reports';
import {getOutcomeSet, IOutcomeResult} from 'apollo/modules/outcomeSets';
import {ServiceReportDetails} from 'components/ServiceReportDetails';

interface IProp extends IReportResult {
  data: IOutcomeResult;
  params: {
      questionSetID: string,
  };
  location: {
    search: string,
  };
}

class ServiceReportInner extends React.Component<IProp, any> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  public render() {
    if (this.props.data.loading || this.props.JOCServiceReport.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    return (
      <Grid container columns={1} id="service-report">
        <Grid.Column>
          <h1>Service Report</h1>
          <ServiceReportDetails serviceReport={this.props.JOCServiceReport.getJOCServiceReport} questionSet={this.props.data.getOutcomeSet} />
        </Grid.Column>
      </Grid>
    );
  }
}

function getQuestionSetIDFromProps(p: IProp): string {
  return p.params.questionSetID;
}

function getStartDateFromProps(p: IProp): string {
  const params = new URLSearchParams(p.location.search);
  return params.get('start');
}

function getEndDateFromProps(p: IProp): string {
  const params = new URLSearchParams(p.location.search);
  return params.get('end');
}

const ServiceReport = getOutcomeSet<IProp>(getQuestionSetIDFromProps)(getJOCServiceReport<IProp>(getQuestionSetIDFromProps, getStartDateFromProps, getEndDateFromProps)(ServiceReportInner));
export {ServiceReport}
