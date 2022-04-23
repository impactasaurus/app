import React, { useEffect, useRef } from "react";
import { getLogoutOptions, getWebAuth } from "helpers/auth";
import { useNavigator } from "redux/modules/url";
import { useSetJWT, useUser } from "redux/modules/user";
import { WebAuth } from "auth0-js";
import { useLocation } from "react-router";
const config = require("../../../../config/main").app.auth;

interface IProps {
  children?: JSX.Element | JSX.Element[];
}

const isPublicPage = (path: string): boolean => {
  for (const p of config.publicPages) {
    if (p.test(path)) {
      return true;
    }
  }
  return false;
};

export const IsLoggedIn = (p: IProps): JSX.Element => {
  const webAuth = useRef<WebAuth>(getWebAuth());
  const setURL = useNavigator();
  const user = useUser();
  const location = useLocation();
  const setJWT = useSetJWT();

  useEffect(() => setup(), [user, location]);

  const sendToLogin = (): void => {
    const redirectURL = location.pathname + location.search;
    setURL(
      "/login",
      new URLSearchParams({ redirect: encodeURIComponent(redirectURL) })
    );
  };

  const sendToNoOrgPage = (): void => {
    setURL("/no-org");
  };

  const setup = () => {
    if (!user.loggedIn && !isPublicPage(location.pathname)) {
      sendToLogin();
      return;
    }
    if (
      user.loggedIn &&
      !user.org &&
      !user.beneficiaryUser &&
      !isPublicPage(location.pathname)
    ) {
      sendToNoOrgPage();
    }
    if (user.logOutRequest !== undefined) {
      setJWT(null);
      webAuth.current.logout(getLogoutOptions(user.logOutRequest));
    }
  };

  return <div>{user.loggedIn && p.children}</div>;
};
