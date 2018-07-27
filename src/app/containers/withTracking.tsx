import * as React from 'react';
import {RouterState} from 'connected-react-router';
const appConfig = require('../../../config/main');
const ReactGA = require('react-ga');

ReactGA.initialize(appConfig.app.analytics.trackingID, {
  debug: appConfig.app.analytics.debug,
});

const withTracker = (WrappedComponent) => {
  const trackPage = (page) => {
    ReactGA.set({page});
    ReactGA.pageview(page);
  };

  const HOC = class extends React.Component<RouterState, any> {
    public componentDidMount() {
      const page = this.props.location.pathname;
      trackPage(page);
    }

    public componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    public render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
};

export default withTracker;
