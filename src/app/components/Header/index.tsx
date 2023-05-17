import * as React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { useLogout, useUser } from "redux/modules/user";
import "./style.less";
import Logo from "../Logo";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProfileMenu } from "./profile";
import { HeaderPlugins } from "./plugins";
import { IntroduceQuestionnairePage } from "components/TourQuestionnaires";
import { IntroduceNewRecordButton } from "components/TourRecordCreation";
import { IntroduceReportPage } from "components/TourReports";
import { MenuItem } from "./item";
const config = require("../../../../config/main").app.auth;

const QuestionnaireButtonID = "questionnaire-menu-item";
const NewRecordButtonID = "add-menu-link";
const ReportButtonID = "reports-menu-item";

const Header = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    org,
    loggedIn: isLoggedIn,
    beneficiaryUser: isBeneficiary,
  } = useUser();
  const { pathname: currentURL } = useLocation();
  const logout = useLogout();

  const isActive = (url: string, exact = false): boolean => {
    if (exact) {
      return currentURL === url;
    }
    return currentURL !== undefined && currentURL.startsWith(url);
  };

  const logOut = () => {
    logout("/login");
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
      <>
        <div className="root menu">
          <div className="top sub-menu">
            <MenuItem active={false} icon={<Logo />} link="/" />
            <MenuItem
              active={isActive("/", true)}
              icon={<Icon name="home" className="replacement" />}
              link="/"
              title={t("Home")}
            />
            <MenuItem
              active={isActive("/beneficiary")}
              icon={<Icon name="user" className="replacement" />}
              link="/beneficiary"
              title={t("Beneficiary")}
            />
            <MenuItem
              active={isActive("/report")}
              icon={<Icon name="line graph" className="replacement" />}
              link="/report"
              title={t("Report")}
            />
            <MenuItem
              active={
                isActive("/catalogue") ||
                isActive("/questions") ||
                isActive("/sequences")
              }
              icon={<Icon name="question" className="replacement" />}
              link="/questions"
              title={t("Questionnaires")}
              id={QuestionnaireButtonID}
            />
            <MenuItem
              active={
                isActive("/record") ||
                isActive("/meeting") ||
                isActive("/dataentry")
              }
              icon={<Icon name="plus" className="replacement" />}
              link="/record"
              title={t("New Record")}
              id={NewRecordButtonID}
            />
          </div>

          <div className="bottom sub-menu">
            <MenuItem
              active={isActive("/settings")}
              icon={<Icon name="cog" className="replacement" />}
              link="/settings"
              title={t("Settings")}
            />
            <ProfileMenu logOut={logOut} />
          </div>
        </div>
        <IntroduceQuestionnairePage id={QuestionnaireButtonID} />
        <IntroduceNewRecordButton id={NewRecordButtonID} />
        <IntroduceReportPage id={ReportButtonID} />
      </>
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
            <Menu.Item
              as={Link}
              to={`/login?redirect=${encodeURIComponent(currentURL)}`}
            >
              {t("Log In")}
            </Menu.Item>
          </Menu.Menu>
        )}
      </Menu>
    );
  }
};

export { Header };
