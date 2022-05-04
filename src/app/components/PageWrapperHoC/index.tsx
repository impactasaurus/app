import * as React from "react";
import Helmet from "react-helmet";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";

export const PageWrapper = (p: {
  children: JSX.Element | JSX.Element[];
  id?: string;
}): JSX.Element => (
  <Grid container={true} columns={1} id={p.id}>
    <Grid.Column>{p.children}</Grid.Column>
  </Grid>
);

export const MinimalPageWrapperHoC = <P extends unknown>(
  title: string,
  id: string,
  WrappedComponent: React.ComponentType<P>
): React.ComponentType => {
  const minPageWrapper = (p: P) => {
    const { t } = useTranslation();
    return (
      <PageWrapper id={id}>
        <Helmet>
          <title>{t(title)}</title>
        </Helmet>
        <WrappedComponent {...p} />
      </PageWrapper>
    );
  };
  return minPageWrapper;
};

export const PageWrapperHoC = <P extends unknown>(
  title: string,
  id: string,
  WrappedComponent: React.ComponentType<P>
): React.ComponentType => {
  const pageWrapper = (p: P) => {
    const { t } = useTranslation();
    return (
      <>
        <h1 key="title">{t(title)}</h1>
        <WrappedComponent key="content" {...p} />
      </>
    );
  };
  return MinimalPageWrapperHoC(title, id, pageWrapper);
};
