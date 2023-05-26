import React from "react";
import { SecondaryMenu } from "components/SecondaryMenu";
import { Sequences } from "containers/Sequences";
import { useTranslation } from "react-i18next";
import { Route, Switch, useLocation, useRouteMatch } from "react-router";
import { useNavigator } from "redux/modules/url";
import { Menu } from "semantic-ui-react";
import { Questionnaires } from ".";
import { Hint } from "components/Hint";
import { SideList } from "components/SideList";
import { OutcomeSet } from "containers/OutcomeSet";
import "./style.less";

export const QuestionnaireRouter = (): JSX.Element => {
  const setURL = useNavigator();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const route = useRouteMatch<{ id: string }>();

  const startsWith = (url: string): boolean => {
    return pathname !== undefined && pathname.startsWith(url);
  };

  const handleClick = (url: string) => {
    return () => setURL(url);
  };

  const deselect = () => {
    if (startsWith("/questions")) {
      setURL("/questions");
    } else {
      setURL("/sequences");
    }
  };

  const qActive = startsWith("/questions");
  const seqActive = startsWith("/sequences");
  const panel = (
    <div id="questionnaire-router">
      <div className="simple-switcher">
        <a
          className={qActive ? "active" : ""}
          onClick={handleClick("/questions")}
        >
          {t("Questionnaires")}
        </a>
        <a
          className={seqActive ? "active" : ""}
          onClick={handleClick("/sequences")}
        >
          {t("Sequences")}
        </a>
      </div>
      <SecondaryMenu>
        <Menu.Item active={qActive} onClick={handleClick("/questions")}>
          {t("Questionnaires")}
        </Menu.Item>
        <Menu.Item active={seqActive} onClick={handleClick("/sequences")}>
          <Hint
            text={t(
              "Combine multiple questionnaires into a sequence of questionnaires"
            )}
          />
          {t("Sequences")}
        </Menu.Item>
      </SecondaryMenu>
      <Switch>
        <Route path={`/questions`} component={Questionnaires} />
        <Route path={`/sequences`} component={Sequences} />
      </Switch>
    </div>
  );
  return (
    <SideList left={panel} selected={route?.params?.id} deselect={deselect}>
      <OutcomeSet match={route} key={route?.params?.id} />
    </SideList>
  );
};
