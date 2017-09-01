import * as React from 'react';
import 'url-search-params-polyfill';

interface IProp {
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

  private getStartDate(props: IProp): Date {
    const params = new URLSearchParams(props.location.search);
    return new Date(params.get('start'));
  }

  private getEndDate(props: IProp): Date {
    const params = new URLSearchParams(props.location.search);
    return new Date(params.get('end'));
  }

  public render() {
    return (
      <div>
        hi
        {this.props.params.questionSetID}
        {this.getStartDate(this.props).toISOString()}
        {this.getEndDate(this.props).toISOString()}
      </div>
    );
  }
}

const ServiceReport = ServiceReportInner;
export {ServiceReport}
