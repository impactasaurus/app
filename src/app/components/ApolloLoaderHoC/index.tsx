import * as React from 'react';
import {QueryProps} from 'react-apollo';
import { Loader } from 'semantic-ui-react';
import {Error} from '../Error';

export const ApolloLoaderHoC = <P extends object>(action: string, queryProps: (p: P) => QueryProps, WrappedComponent: React.ComponentType<P>) => {
  class Inner extends React.Component<P, any> {
    public render() {
      const qp = queryProps(this.props);
      if (!qp) {
        return (<span />);
      }
      if (qp.error) {
        return (<Error text={`Failed to ${action}`} />);
      }
      if (qp.loading) {
        return (<Loader active={true} inline="centered" />);
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return Inner;
};
