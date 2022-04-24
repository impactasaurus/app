import React, { useState, useEffect } from "react";
import { IURLConnector, UrlHOC } from "redux/modules/url";
import { getJWT, IJWTResult } from "apollo/modules/jwt";
import { Message, Loader } from "semantic-ui-react";
import { Error } from "components/Error";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import { useSetJWT, useUser } from "redux/modules/user";

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
  const setJWT = useSetJWT();
  const user = useUser();

  useEffect(() => {
    if (!p.data?.getJWT || user.JWT !== p.data?.getJWT) {
      return;
    }
    if (user.expiry === null || user.expiry < new Date()) {
      setError(true);
      setExpired(true);
      return;
    }
    if (!user.beneficiaryUser) {
      setError(true);
      setExpired(false);
      return;
    }
    if (!user.beneficiaryScope) {
      setError(true);
      setExpired(false);
      return;
    }
    logSuccessfulBenLogin();
    p.setURL(`/meeting/${user.beneficiaryScope}`);
  }, [user]);

  useEffect(() => {
    if (!p.data?.getJWT) {
      return;
    }
    setJWT(p.data.getJWT);
  }, [p.data.getJWT]);

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
