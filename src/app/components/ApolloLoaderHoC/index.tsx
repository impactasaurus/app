import React from 'react';
import {ApolloError, QueryProps} from 'react-apollo';
import {Loader} from 'semantic-ui-react';
import {Error} from 'components/Error';
import {useTranslation} from 'react-i18next';

// entity is a description of what is loading, it is used in a sentence `Failed to load X`
// queryProps takes the props and should return the QueryProps we are waiting for
// WrappedComponent should be the react component being wrapped by this HoC
export const ApolloLoaderHoC = <P extends unknown>(
  entity: string,
  queryProps: (p: P) => QueryProps,
  WrappedComponent: React.ComponentType<P>,
  isErrorTerminal: (err: ApolloError) => boolean = () => true,
): React.ComponentType<P> => {
  const Inner = (p: P) => {
    const qp = queryProps(p);
    if (!qp) {
      return <span />;
    }
    if (qp.error && isErrorTerminal(qp.error)) {
      const {t} = useTranslation();
      const text = t("Failed to load {entity}", {entity: t(entity)});
      return <Error text={text} />;
    }
    if (qp.loading) {
      return <Loader active={true} inline="centered" />;
    }
    return <WrappedComponent {...p} />;
  }
  return Inner;
};
