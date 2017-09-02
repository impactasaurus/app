import * as React from 'react';
import 'url-search-params-polyfill';
import { Grid, Loader } from 'semantic-ui-react';
import {getJOCServiceReport, IReportResult} from 'apollo/modules/reports';

interface IProp {
  data: IReportResult;
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
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    return (
      <Grid container columns={1} id="service-report">
        <Grid.Column>
          {JSON.stringify(this.props.data.getJOCServiceReport)}
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

const ServiceReport = getJOCServiceReport<IProp>(getQuestionSetIDFromProps, getStartDateFromProps, getEndDateFromProps)(ServiceReportInner);
export {ServiceReport}
