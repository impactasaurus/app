import React, { useState } from "react";
import { ApolloError, QueryProps } from "react-apollo";
import { Grid, Loader } from "semantic-ui-react";
import { Error } from "components/Error";
import { useTranslation } from "react-i18next";

interface IOptions {
  isErrorTerminal?: (err: ApolloError) => boolean;
  wrapInGrid?: boolean; // defaults to false, normally used in page with existing grid
}

// entity is a description of what is loading, it is used in a sentence `Failed to load X`
// queryProps takes the props and should return the QueryProps we are waiting for
// WrappedComponent should be the react component being wrapped by this HoC
export const ApolloLoaderHoC = <P extends unknown>(
  entity: string,
  queryProps: (p: P) => QueryProps,
  WrappedComponent: React.ComponentType<P>,
  opts?: IOptions
): React.ComponentType<P> => {
  const Inner = (p: P) => {
    const [prevLoaded, setPrevLoaded] = useState(false);
    const { t } = useTranslation();
    const qp = queryProps(p);
    if (!qp) {
      return <span />;
    }
    const options: IOptions = {
      isErrorTerminal: () => true,
      wrapInGrid: false,
      ...opts,
    };
    const Wrapper = (p: { children: JSX.Element }): JSX.Element => {
      if (options.wrapInGrid) {
        return (
          <Grid container={true} columns={1}>
            <Grid.Column>{p.children}</Grid.Column>
          </Grid>
        );
      }
      return p.children;
    };
    if (qp.error && options.isErrorTerminal(qp.error)) {
      const text = t("Failed to load {entity}", { entity: t(entity) });
      return (
        <Wrapper>
          <Error text={text} />
        </Wrapper>
      );
    }
    if (qp.loading && !prevLoaded) {
      return (
        <Wrapper>
          <Loader active={true} inline="centered" />
        </Wrapper>
      );
    }
    if (!prevLoaded) {
      setPrevLoaded(true);
    }
    return <WrappedComponent {...p} />;
  };
  return Inner;
};
