import * as React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { bindActionCreators } from "redux";
import { IStore } from "redux/IStore";
import {
  isUserLoggedIn,
  isBeneficiaryUser,
  RequestLogoutFunc,
  requestLogOut,
} from "redux/modules/user";
import "./style.less";
import Logo from "../Logo";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProfileMenu } from "./profile";
import { connect } from "react-redux";
import { HeaderPlugins } from "./plugins";
import { getOrganisation } from "helpers/auth";
import { TourStage } from "redux/modules/tour";
import { TourPointer } from "components/TourPointer";
const config = require("../../../../config/main").app.auth;

interface IProps {
  currentURL?: string;
  isLoggedIn?: boolean;
  isBeneficiary?: boolean;
  logout?: RequestLogoutFunc;
}

const QuestionnaireButtonID = "questionnaire-menu-item";

const HeaderInner = (p: IProps) => {
  const { t } = useTranslation();

  const isActive = (url: string, exact = false): boolean => {
    if (exact) {
      return p.currentURL === url;
    }
    return p.currentURL !== undefined && p.currentURL.startsWith(url);
  };

  const logOut = () => {
    p.logout("/login");
  };

  const shouldShowLoginPrompt = () => {
    for (const lp of config.loginPrompt) {
      if (lp.test(p.currentURL)) {
        return true;
      }
    }
    return false;
  };

  const { isLoggedIn, isBeneficiary } = p;
  const org = getOrganisation();
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
        <Menu.Item as={Link} to="/report" active={isActive("/report")}>
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
          id="add-menu-link"
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
        <TourPointer
          content={t("test")}
          target={`#${QuestionnaireButtonID}`}
          stage={TourStage.QUESTIONNAIRE_1}
          transitionOnLocationChange={TourStage.QUESTIONNAIRE_2}
        />
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

const stateToProps = (state: IStore) => ({
  isLoggedIn: isUserLoggedIn(state.user),
  isBeneficiary: isBeneficiaryUser(state.user),
  currentURL: state.router.location.pathname,
});

const dispatchToProps = (dispatch) => ({
  logout: bindActionCreators(requestLogOut, dispatch),
});

const Header = connect(stateToProps, dispatchToProps)(HeaderInner);
export { Header };
