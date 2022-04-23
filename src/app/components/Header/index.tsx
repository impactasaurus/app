import * as React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { RequestLogoutFunc, useUser } from "redux/modules/user";
import "./style.less";
import Logo from "../Logo";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProfileMenu } from "./profile";
import { HeaderPlugins } from "./plugins";
import { IntroduceQuestionnairePage } from "components/TourQuestionnaires";
import { IntroduceNewRecordButton } from "components/TourRecordCreation";
import { IntroduceReportPage } from "components/TourReports";
const config = require("../../../../config/main").app.auth;

interface IProps {
  logout?: RequestLogoutFunc;
}

const QuestionnaireButtonID = "questionnaire-menu-item";
const NewRecordButtonID = "add-menu-link";
const ReportButtonID = "reports-menu-item";

const Header = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const {
    org,
    loggedIn: isLoggedIn,
    beneficiaryUser: isBeneficiary,
  } = useUser();
  const { pathname: currentURL } = useLocation();

  const isActive = (url: string, exact = false): boolean => {
    if (exact) {
      return currentURL === url;
    }
    return currentURL !== undefined && currentURL.startsWith(url);
  };

  const logOut = () => {
    p.logout("/login");
  };

  const shouldShowLoginPrompt = () => {
    for (const lp of config.loginPrompt) {
      if (lp.test(currentURL)) {
        return true;
      }
    }
    return false;
  };

  if (isLoggedIn && isBeneficiary !== true && org) {
    return (
      <Menu size="massive">
        <Menu.Item
          as={Link}
          to="/"
          active={isActive("/", true)}
          id="home-link"
          className="icon-menu-item"
        >
          <Logo />
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/beneficiary"
          active={isActive("/beneficiary")}
        >
          <Icon name="user" className="replacement" />
          <span className="title">{t("Beneficiary")}</span>
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/report"
          active={isActive("/report")}
          id={ReportButtonID}
        >
          <Icon name="line graph" className="replacement" />
          <span className="title">{t("Report")}</span>
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/questions"
          active={isActive("/catalogue") || isActive("/questions")}
          id={QuestionnaireButtonID}
        >
          <Icon name="question" className="replacement" />
          <span className="title">{t("Questionnaires")}</span>
        </Menu.Item>
        <HeaderPlugins isActive={isActive} />
        <Menu.Item
          as={Link}
          to="/record"
          active={
            isActive("/record") ||
            isActive("/meeting") ||
            isActive("/dataentry")
          }
          id={NewRecordButtonID}
        >
          <Icon name="plus" className="required" />
        </Menu.Item>

        <Menu.Menu className="right" position="right">
          <Menu.Item as={Link} to="/settings" active={isActive("/settings")}>
            <Icon name="cog" className="replacement" />
            <span className="title">{t("Settings")}</span>
          </Menu.Item>
          <ProfileMenu logOut={logOut} />
        </Menu.Menu>
        <IntroduceQuestionnairePage id={QuestionnaireButtonID} />
        <IntroduceNewRecordButton id={NewRecordButtonID} />
        <IntroduceReportPage id={ReportButtonID} />
      </Menu>
    );
  } else if (isLoggedIn) {
    return (
      <Menu size="massive">
        <Menu.Item id="home-link">
          <Logo />
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item onClick={logOut}>{t("Log Out")}</Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  } else {
    return (
      <Menu size="massive">
        <Menu.Item
          as={Link}
          to="/"
          active={isActive("/", true)}
          id="home-link"
          className="icon-menu-item"
        >
          <Logo />
        </Menu.Item>
        {shouldShowLoginPrompt() && (
          <Menu.Menu position="right">
            <Menu.Item as={Link} to="/login">
              {t("Log In")}
            </Menu.Item>
          </Menu.Menu>
        )}
      </Menu>
    );
  }
};

export { Header };
