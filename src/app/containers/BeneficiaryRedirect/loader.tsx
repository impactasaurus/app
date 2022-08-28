import React, { useState, useEffect } from "react";
import { useNavigator } from "redux/modules/url";
import { getJWT, IJWTResult } from "apollo/modules/jwt";
import { Message, Loader } from "semantic-ui-react";
import { Error } from "components/Error";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import { useSession, useSetJWT, useUser } from "redux/modules/user";
import {
  externalLinkURI,
  forwardURLParam,
  isUrlAbsolute,
  meetingURI,
} from "helpers/url";

interface IProps {
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
  const { beneficiaryUser, beneficiarySequence } = useUser();
  const { JWT, expiry } = useSession();
  const setURL = useNavigator();

  useEffect(() => {
    if (!p.data?.getJWT || JWT !== p.data?.getJWT) {
      return;
    }
    if (expiry === null || expiry < new Date()) {
      setError(true);
      setExpired(true);
      return;
    }
    if (!beneficiaryUser) {
      setError(true);
      setExpired(false);
      return;
    }
    if (
      !Array.isArray(beneficiarySequence) ||
      beneficiarySequence.length === 0
    ) {
      setError(true);
      setExpired(false);
      return;
    }
    const urlSequence = beneficiarySequence.map((s) =>
      isUrlAbsolute(s) ? externalLinkURI(s) : meetingURI(s)
    );
    logSuccessfulBenLogin();
    setURL(
      urlSequence[0],
      urlSequence.length > 1
        ? forwardURLParam(urlSequence.splice(1))
        : undefined
    );
  }, [beneficiarySequence, beneficiaryUser]);

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

export const JTILoader = getJWT<IProps>((props) => props.jti)(JTILoaderInner);
