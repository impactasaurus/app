import React from "react";
import { Helmet } from "react-helmet";
import { Menu } from "semantic-ui-react";
import { IURLConnector, UrlConnector } from "redux/modules/url";
import { IStore } from "redux/IStore";
import { Switch } from "react-router-dom";
import * as containers from "containers";
import { SecondaryMenu } from "components/SecondaryMenu";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import Route from "components/Route";

interface IProps extends IURLConnector {
  currentURL?: string;
  match?: {
    url: string;
  };
}

const SettingsInner = (p: IProps) => {
  const { t } = useTranslation();

  const isSelected = (url: string): boolean => {
    return p.currentURL !== undefined && p.currentURL.includes(url);
  };

  const isExact = (url: string): boolean => {
    return p.currentURL !== undefined && p.currentURL === url;
  };

  const handleClick = (url: string) => {
    return () => {
      p.setURL(url);
    };
  };

  const match = p.match.url;
  return (
    <div id="settings">
      <Helmet>
        <title>{t("Settings")}</title>
      </Helmet>
      <SecondaryMenu>
        <Menu.Item
          active={
            isSelected("/settings/data") ||
            isExact(`${match}/`) ||
            isExact(`${match}`)
          }
          onClick={handleClick("/settings/data")}
        >
          {t("Data")}
        </Menu.Item>
        <Menu.Item
          active={isSelected("/settings/users")}
          onClick={handleClick("/settings/users")}
        >
          {t("Users")}
        </Menu.Item>
      </SecondaryMenu>

      <Switch>
        <Route exact={true} path={`${match}/`} component={containers.Data} />
        <Route
          path={`${match}/data/questionnaire/export/:id`}
          component={containers.ExportQuestionnaire}
        />
        <Route path={`${match}/data`} component={containers.Data} />
        <Route path={`${match}/users`} component={containers.Users} />
      </Switch>
    </div>
  );
};

const storeToProps = (state: IStore): IProps => {
  return {
    currentURL: state.router.location.pathname,
  };
};

export const Settings = connect(storeToProps, UrlConnector)(SettingsInner);
