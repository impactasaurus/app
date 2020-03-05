import * as React from 'react';
import Helmet from 'react-helmet';
import {Grid} from 'semantic-ui-react';

export const MinimalPageWrapperHoC = <P extends object>(
  title: string,
  id: string,
  WrappedComponent: React.ComponentType<P>,
) => {
  class Inner extends React.Component<P, any> {
    public render() {
      return (
        <Grid container={true} columns={1} id={id}>
          <Grid.Column>
            <Helmet>
              <title>{title}</title>
            </Helmet>
            <WrappedComponent {...this.props} />
          </Grid.Column>
        </Grid>
      );
    }
  }
  return Inner;
};

export const PageWrapperHoC = <P extends object>(
  title: string,
  id: string,
  WrappedComponent: React.ComponentType<P>,
) => {
  // tslint:disable-next-line:max-classes-per-file
  class Inner extends React.Component<P, any> {
    public render() {
      return [
        (<h1>{title}</h1>),
        (<WrappedComponent {...this.props} />),
      ];
    }
  }
  return MinimalPageWrapperHoC(title, id, Inner);
};
