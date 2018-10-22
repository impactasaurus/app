import * as React from 'react';
import {QueryProps} from 'react-apollo';
import { Loader } from 'semantic-ui-react';
import {Error} from 'components/Error';

// entity is a description of what is loading, it is used in a sentence `Failed to load X`
// queryProps takes the props and should return the QueryProps we are waiting for
// WrappedComponent should be the react component being wrapped by this HoC
export const ApolloLoaderHoC = <P extends object>(
  entity: string,
  queryProps: (p: P) => QueryProps,
  WrappedComponent: React.ComponentType<P>,
) => {
  class Inner extends React.Component<P, any> {
    public render() {
      const qp = queryProps(this.props);
      if (!qp) {
        return <span />;
      }
      if (qp.error) {
        return <Error text={`Failed to load ${entity}`} />;
      }
      if (qp.loading) {
        return <Loader active={true} inline="centered" />;
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return Inner;
};
