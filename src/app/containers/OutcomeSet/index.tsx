import * as React from "react";
import { Helmet } from "react-helmet";
import { IOutcomeResult, getOutcomeSet } from "apollo/modules/outcomeSets";
import { Grid, Loader, Menu } from "semantic-ui-react";
import { SecondaryMenu } from "components/SecondaryMenu";
import { General } from "./general";
import { Questions } from "./questions";
import { Categories } from "./categories";
import { Error } from "components/Error";
import { Switch, Route } from "react-router-dom";
import "./style.less";
import { IStore } from "redux/IStore";
import { IURLConnector, UrlConnector } from "redux/modules/url";
import { Hint } from "components/Hint";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

export enum Page {
  GENERAL,
  QUESTIONS,
  CATEGORIES,
}

interface IProps extends IURLConnector {
  data: IOutcomeResult;
  match: {
    params: {
      id: string;
    };
    path: string;
    url: string;
  };
  page?: Page;
}

const OutcomeSetInner = (p: IProps) => {
  const handleClick = (url: string, search?: string) => {
    return () => {
      p.setURL(url, search);
    };
  };

  const innerPageSetter = (toSet: Page): (() => void) => {
    return () => {
      let subPage: string;
      switch (toSet) {
        case Page.QUESTIONS: {
          subPage = "questions";
          break;
        }
        case Page.CATEGORIES: {
          subPage = "categories";
          break;
        }
        default: {
          subPage = "";
          break;
        }
      }
      handleClick(`/questions/${p.match.params.id}/${subPage}`)();
    };
  };

  const wrapper = (inner: JSX.Element, signpost?: string): JSX.Element => {
    return (
      <div>
        <SecondaryMenu signpost={signpost}>
          <Menu.Item
            active={page === Page.GENERAL}
            onClick={innerPageSetter(Page.GENERAL)}
          >
            {t("General")}
          </Menu.Item>
          <Menu.Item
            active={page === Page.QUESTIONS}
            onClick={innerPageSetter(Page.QUESTIONS)}
          >
            {t("Questions")}
          </Menu.Item>
          <Menu.Item
            active={page === Page.CATEGORIES}
            onClick={innerPageSetter(Page.CATEGORIES)}
          >
            <Hint
              text={t(
                "Group related questions into categories. This allows aggregation of multiple questions into a single value."
              )}
            />
            {t("Categories")}
          </Menu.Item>
        </SecondaryMenu>
        <Grid container={true} columns={1} id="question-set">
          <Grid.Column>
            <Helmet>
              <title>{signpost ? signpost : t("Questionnaire")}</title>
            </Helmet>
            <div>{inner}</div>
          </Grid.Column>
        </Grid>
      </div>
    );
  };

  const { t } = useTranslation();
  const {
    data: { loading, getOutcomeSet, error },
    page,
  } = p;

  if (error) {
    return wrapper(
      <Error text={t("Failed to load questionnaire")} />,
      "Unknown"
    );
  }
  if (loading) {
    return wrapper(<Loader active={true} inline="centered" />, t("Loading..."));
  }
  if (getOutcomeSet === undefined) {
    return wrapper(<div />, t("Loading..."));
  }

  const match = p.match.path;
  return wrapper(
    <Switch>
      <Route exact={true} path={`${match}/`} component={General} />
      <Route path={`${match}/questions`} component={Questions} />
      <Route path={`${match}/categories`} component={Categories} />
    </Switch>,
    getOutcomeSet.name
  );
};

const extractPageFromStore = (state: IStore) => {
  let page = Page.GENERAL;
  if (state.router.location.pathname.endsWith("questions")) {
    page = Page.QUESTIONS;
  } else if (state.router.location.pathname.endsWith("categories")) {
    page = Page.CATEGORIES;
  }
  return {
    page,
  };
};

const OutcomeSetConnected = connect(
  extractPageFromStore,
  UrlConnector
)(OutcomeSetInner);
export const OutcomeSet = getOutcomeSet<IProps>(
  (props) => props.match.params.id
)(OutcomeSetConnected);
