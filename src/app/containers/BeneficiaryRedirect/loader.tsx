import React, { useState, useEffect } from "react";
import {
  saveAuth,
  isBeneficiaryUser,
  getBeneficiaryScope,
  getExpiryDateOfToken,
} from "helpers/auth";
import { IURLConnector, UrlHOC } from "redux/modules/url";
import { getJWT, IJWTResult } from "apollo/modules/jwt";
import { Message, Loader } from "semantic-ui-react";
import { Error } from "components/Error";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";

interface IProps extends IURLConnector {
  jti: string;
  data?: IJWTResult;
}

const logSuccessfulBenLogin = () => {
  ReactGA.event({
    category: "beneficiary",
    action: "login",
    label: "jti",
  });
};

const JTILoaderInner = (p: IProps) => {
  const [error, setError] = useState(false);
  const [expired, setExpired] = useState(false);
  const { t } = useTranslation();

  const performLoginProcess = () => {
    if (p.data.getJWT === undefined || p.data.getJWT === null) {
      return;
    }
    const token = p.data.getJWT;
    const expires = getExpiryDateOfToken(token);
    if (expires === null || expires < new Date()) {
      setError(true);
      setExpired(true);
      return;
    }
    saveAuth(token);
    if (isBeneficiaryUser() === false) {
      setError(true);
      setExpired(false);
      return;
    }
    const scope = getBeneficiaryScope();
    if (scope === null) {
      setError(true);
      setExpired(false);
      return;
    }
    logSuccessfulBenLogin();
    p.setURL(`/meeting/${scope}`);
  };

  useEffect(performLoginProcess, [p.data.getJWT]);

  if (p.data.loading || (p.data.error === undefined && error === false)) {
    return <Loader active={true} inline="centered" />;
  }
  if (expired) {
    return (
      <Message error={true}>
        <Message.Header>{t("Expired")}</Message.Header>
        <div>{t("This link has expired. Please request a new link")}</div>
      </Message>
    );
  }
  return <Error text={t("This link does not seem to be valid")} />;
};

const JTILoaderConnected = UrlHOC(JTILoaderInner);
export const JTILoader = getJWT<IProps>((props) => props.jti)(
  JTILoaderConnected
);
