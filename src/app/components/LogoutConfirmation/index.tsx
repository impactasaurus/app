import * as React from "react";
import { Message, Button } from "semantic-ui-react";
import { requestLogOut, RequestLogoutFunc } from "../../redux/modules/user";
import { bindActionCreators } from "redux";
import { IStore } from "../../redux/IStore";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface IProps {
  currentURL?: string;
  logout?: RequestLogoutFunc;
}

const LoggedInUserConfirmationInner = (p: IProps) => {
  const confirmed = () => {
    p.logout(p.currentURL);
  };

  const { t } = useTranslation();
  return (
    <Message warning={true}>
      <Message.Header>{t("Warning")}</Message.Header>
      <div>{t("Using this link will log you out of Impactasaurus")}</div>
      <br />
      <Button onClick={confirmed}>{t("Continue")}</Button>
    </Message>
  );
};

const storeToProps = (state: IStore) => ({
  currentURL: state.router.location.pathname,
});

const dispatchToProps = (dispatch) => ({
  logout: bindActionCreators(requestLogOut, dispatch),
});

export const LoggedInUserConfirmation = connect(
  storeToProps,
  dispatchToProps
)(LoggedInUserConfirmationInner);
