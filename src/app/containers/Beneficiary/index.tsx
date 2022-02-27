import React from "react";
import { Helmet } from "react-helmet";
import { Grid, Icon, Menu } from "semantic-ui-react";
import { IURLConnector, UrlConnector } from "redux/modules/url";
import { IStore } from "redux/IStore";
import { Switch, Route } from "react-router-dom";
import * as containers from "containers";
import { SecondaryMenu } from "components/SecondaryMenu";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import "./style.less";

interface IProps extends IURLConnector {
  match: {
    params: {
      id: string;
    };
    path: string;
    url: string;
  };
  child: ReviewPage;
}

export enum ReviewPage {
  JOURNEY,
  RECORDS,
  NEW_RECORD,
  CONFIG,
}

const BeneficiaryInner = (p: IProps) => {
  const { t } = useTranslation();

  const handleClick = (url: string, search?: string) => {
    return () => {
      p.setURL(url, search);
    };
  };

  const innerPageSetter = (
    toSet: ReviewPage,
    search?: string
  ): (() => void) => {
    return () => {
      let subPage: string;
      switch (toSet) {
        case ReviewPage.JOURNEY: {
          subPage = "journey";
          break;
        }
        case ReviewPage.RECORDS: {
          subPage = "records";
          break;
        }
        case ReviewPage.NEW_RECORD: {
          subPage = "record";
          break;
        }
        case ReviewPage.CONFIG: {
          subPage = "config";
          break;
        }
        default: {
          subPage = "journey";
          break;
        }
      }
      handleClick(`/beneficiary/${p.match.params.id}/${subPage}`, search)();
    };
  };

  const ben = p.match.params.id;
  if (ben === undefined) {
    return <div />;
  }

  const match = p.match.path;

  return (
    <div>
      <SecondaryMenu signpost={ben}>
        <Menu.Item
          active={p.child === ReviewPage.JOURNEY}
          onClick={innerPageSetter(ReviewPage.JOURNEY)}
        >
          <Icon name="chart line" />
          {t("Journey")}
        </Menu.Item>
        <Menu.Item
          active={p.child === ReviewPage.RECORDS}
          onClick={innerPageSetter(ReviewPage.RECORDS)}
        >
          <Icon name="file outline" />
          {t("Records")}
        </Menu.Item>
        <Menu.Item
          active={p.child === ReviewPage.NEW_RECORD}
          onClick={innerPageSetter(ReviewPage.NEW_RECORD, `?ben=${ben}`)}
        >
          <Icon name="plus" />
          {t("New Record")}
        </Menu.Item>
        <Menu.Item
          active={p.child === ReviewPage.CONFIG}
          onClick={innerPageSetter(ReviewPage.CONFIG)}
        >
          <Icon name="cog" />
          {t("Admin")}
        </Menu.Item>
      </SecondaryMenu>
      <Grid container={true} columns={1}>
        <Grid.Column>
          <div id="review">
            <Helmet>
              <title>{ben}</title>
            </Helmet>
            <Switch>
              <Route
                exact={true}
                path={`${match}/`}
                component={containers.Journey}
              />
              <Route path={`${match}/journey`} component={containers.Journey} />
              <Route path={`${match}/records`} component={containers.Records} />
              <Route
                path={`${match}/config`}
                component={containers.BeneficiaryConfig}
              />
              <Route
                path={`${match}/record/:type`}
                component={containers.AssessmentConfig}
              />
              <Route
                path={`${match}/record`}
                component={containers.AssessmentTypeSelect}
              />
            </Switch>
          </div>
        </Grid.Column>
      </Grid>
    </div>
  );
};

const stateToProps = (state: IStore, p: IProps) => {
  let child = ReviewPage.NEW_RECORD;
  if (
    state.router.location.pathname.endsWith("journey") ||
    p.match.url === state.router.location.pathname
  ) {
    child = ReviewPage.JOURNEY;
  } else if (state.router.location.pathname.endsWith("records")) {
    child = ReviewPage.RECORDS;
  } else if (state.router.location.pathname.endsWith("config")) {
    child = ReviewPage.CONFIG;
  }
  return {
    child,
  };
};

const Beneficiary = connect(stateToProps, UrlConnector)(BeneficiaryInner);
export { Beneficiary };
