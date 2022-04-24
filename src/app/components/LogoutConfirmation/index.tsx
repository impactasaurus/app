import * as React from "react";
import { Message, Button } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { requestLogOut } from "../../redux/modules/user";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";

const LogoutConfirmationInner = (): JSX.Element => {
  const dispatch = useDispatch();
  const { pathname: currentURL } = useLocation();

  const confirmed = () => {
    dispatch(requestLogOut(currentURL));
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

export const LogoutConfirmation = MinimalPageWrapperHoC(
  "Logout Confirmation",
  "logout-confirmation",
  LogoutConfirmationInner
);
