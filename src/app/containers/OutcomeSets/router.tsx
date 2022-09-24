import React from "react";
import { SecondaryMenu } from "components/SecondaryMenu";
import { Sequences } from "containers/Sequences";
import { useTranslation } from "react-i18next";
import { Route, Switch, useLocation } from "react-router";
import { useNavigator } from "redux/modules/url";
import { Menu } from "semantic-ui-react";
import { Questionnaires } from ".";
import { useUser } from "redux/modules/user";
import { Hint } from "components/Hint";

export const QuestionnaireRouter = (): JSX.Element => {
  const setURL = useNavigator();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { userID } = useUser();

  const showMenu = userID === "auth0|58d01192586ebb4260567993";

  const isExact = (url: string): boolean => {
    return pathname !== undefined && pathname === url;
  };

  const handleClick = (url: string) => {
    return () => {
      setURL(url);
    };
  };

  return (
    <div>
      {showMenu && (
        <SecondaryMenu>
          <Menu.Item
            active={isExact("/questions") || isExact(`/questions/`)}
            onClick={handleClick("/questions")}
          >
            {t("Questionnaires")}
          </Menu.Item>
          <Menu.Item
            active={isExact("/sequences") || isExact(`/sequences/`)}
            onClick={handleClick("/sequences")}
          >
            <Hint
              text={t(
                "Combine multiple questionnaires into a sequence of questionnaires"
              )}
            />
            {t("Sequences")}
          </Menu.Item>
        </SecondaryMenu>
      )}
      <Switch>
        <Route exact={true} path={`/questions`} component={Questionnaires} />
        <Route path={`/sequences`} component={Sequences} />
      </Switch>
    </div>
  );
};
