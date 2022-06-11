import React from "react";
import { Helmet } from "react-helmet";
import { IOutcomeResult, getOutcomeSet } from "apollo/modules/outcomeSets";
import { Grid, Menu, Message } from "semantic-ui-react";
import { SecondaryMenu } from "components/SecondaryMenu";
import { General } from "./general";
import { Questions } from "./questions";
import { Categories } from "./categories";
import { Switch } from "react-router-dom";
import { useNavigator } from "redux/modules/url";
import { Hint } from "components/Hint";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Location } from "history";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import "./style.less";
import Route from "components/Route";
import { TooltipIcon } from "components/TooltipIcon";

export enum Page {
  GENERAL,
  QUESTIONS,
  CATEGORIES,
}

interface IProps {
  data: IOutcomeResult;
  match: {
    params: {
      id: string;
    };
    path: string;
  };
}

const currentPage = (location: Location): Page => {
  let page = Page.GENERAL;
  if (location.pathname.endsWith("questions")) {
    page = Page.QUESTIONS;
  } else if (location.pathname.endsWith("categories")) {
    page = Page.CATEGORIES;
  }
  return page;
};

const OutcomeSetInner = (p: IProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const setURL = useNavigator();
  const page = currentPage(location);

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
      setURL(`/questions/${p.match.params.id}/${subPage}`);
    };
  };

  const match = p.match.path;
  const qq = p.data.getOutcomeSet;
  const title = (
    <>
      {qq.readOnly && (
        <TooltipIcon
          i={{ name: "lock", size: "small" }}
          tooltipContent={t("Read only")}
        />
      )}
      {qq.name}
    </>
  );
  return (
    <div>
      <SecondaryMenu signpost={title}>
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
            <title>{qq.name}</title>
          </Helmet>
          {qq.readOnly && (
            <Message warning={true} className="readonly-message">
              <Message.Header>{t("Read Only")}</Message.Header>
              <Message.Content>
                {t(
                  "This questionnaire cannot be edited as it has been imported from another Impactasaurus account."
                )}
                <br />
                {t("If this is unexpected, please contact support.")}
              </Message.Content>
            </Message>
          )}
          <Switch>
            <Route exact={true} path={`${match}/`} component={General} />
            <Route path={`${match}/questions`} component={Questions} />
            <Route path={`${match}/categories`} component={Categories} />
          </Switch>
        </Grid.Column>
      </Grid>
    </div>
  );
};

// t("questionnaire")
const OutcomeSetWithLoader = ApolloLoaderHoC<IProps>(
  "questionnaire",
  (p) => p.data,
  OutcomeSetInner,
  {
    wrapInGrid: true,
  }
);
export const OutcomeSet = getOutcomeSet<IProps>(
  (props) => props.match.params.id
)(OutcomeSetWithLoader);
