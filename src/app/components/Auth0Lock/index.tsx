import React, { useState, useEffect } from "react";
import { Auth0Error, WebAuth } from "auth0-js";
import { saveAuth, getWebAuth } from "helpers/auth";
import { Message } from "semantic-ui-react";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import "./style.less";

interface IProps {
  onAuthenticated?: () => void;
}

const Auth0Lock = (p: IProps): JSX.Element => {
  const [error, setError] = useState<Auth0Error>(undefined);

  const parseRedirect = (
    webAuth: WebAuth,
    onFailure: (error: Auth0Error) => void
  ): void => {
    webAuth.parseHash((err, authResult) => {
      if (err || authResult === null || authResult === undefined) {
        onFailure(err);
        return;
      }
      saveAuth(authResult.idToken);
      if (p.onAuthenticated) {
        p.onAuthenticated();
      }
    });
  };

  useEffect(() => {
    const webAuth = getWebAuth();
    parseRedirect(webAuth, (err: Auth0Error) => {
      if (err) {
        ReactGA.event({
          category: "login",
          action: "failed",
          label: err.errorDescription,
        });
        setError(err);
      } else {
        webAuth.authorize();
      }
    });
  }, []);

  const { t } = useTranslation();
  if (error !== undefined) {
    return (
      <Message error={true}>
        <Message.Header>{t("Failed to login")}</Message.Header>
        <Message.Content>{error.errorDescription}</Message.Content>
      </Message>
    );
  }
  return <div>{t("Redirecting to login...")}</div>;
};

export { Auth0Lock };
