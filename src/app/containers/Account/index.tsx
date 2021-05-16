import React, { useState } from "react";
import { Button, Message } from "semantic-ui-react";
import { getUserEmail, getWebAuth } from "../../helpers/auth";
import { UserSettings } from "components/UserSettings";
import ReactGA from "react-ga";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import * as config from "../../../../config/main";
import { useTranslation } from "react-i18next";

const AccountInner = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const { t } = useTranslation();

  const startChangePassword = () => {
    setTriggered(true);

    const email = getUserEmail();
    if (email === null) {
      setError(
        t("Failed to gather your email address, please try refreshing the page")
      );
      return;
    }

    setLoading(true);
    getWebAuth().changePassword(
      {
        connection: config.app.auth.connection,
        email,
      },
      (err) => {
        if (err) {
          setLoading(false);
          setError(
            t(
              "Failed to trigger password reset, please try refreshing the page"
            )
          );
          setTriggered(true);
          ReactGA.event({
            category: "password_reset",
            action: "failed",
            label: err.description,
          });
        } else {
          setLoading(false);
          setError(null);
          setTriggered(true);
          ReactGA.event({
            category: "password_reset",
            action: "success",
          });
        }
      }
    );
  };

  const renderChangePassword = () => {
    if (triggered === false || loading === true) {
      return (
        <Button
          key="security-loading"
          loading={loading}
          onClick={startChangePassword}
        >
          {t("Click here to change your password")}
        </Button>
      );
    }
    if (error === null) {
      return (
        <Message key="security-success" positive={true}>
          <Message.Header>{t("Success")}</Message.Header>
          <Message.Content>
            {t(
              "You will shortly receive an email which will allow you to reset your password"
            )}
          </Message.Content>
        </Message>
      );
    }
    return (
      <Message key="security-fail" warning={true}>
        <Message.Header>{t("Error")}</Message.Header>
        <Message.Content>{error}</Message.Content>
      </Message>
    );
  };

  const additionalFields = [
    <h3 key="security-header">{t("Security")}</h3>,
    renderChangePassword(),
  ];
  return <UserSettings additionalFields={additionalFields} />;
};

// t("Profile")
const Account = PageWrapperHoC("Profile", "Account", AccountInner);
export { Account };
