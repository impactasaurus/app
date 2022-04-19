import React, { useEffect, useRef } from "react";
import {
  getUserID,
  saveAuth,
  isBeneficiaryUser,
  getOrganisation,
  clearAuth,
  getLogoutOptions,
  getWebAuth,
  getTimeToExpiry,
  isStoredJWTValid,
} from "helpers/auth";
import { useNavigator } from "redux/modules/url";
import { useUser, useSetUser } from "redux/modules/user";
import { WebAuth } from "auth0-js";
import ReactGA from "react-ga";
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
  const timer = useRef<number>();
  const setURL = useNavigator();
  const stateUser = useUser();
  const location = useLocation();
  const setUser = useSetUser();

  useEffect(() => setup(), [stateUser, location]);

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

  const refreshToken = () => {
    webAuth.current.checkSession({}, (err, authResult) => {
      if (err !== undefined && err !== null) {
        console.error(err.description);
        ReactGA.event({
          category: "silent_auth",
          action: "failed",
          label: err.description,
        });
        return;
      }
      ReactGA.event({
        category: "silent_auth",
        action: "success",
      });
      saveAuth(authResult.idToken);
      setup();
    });
  };

  const setupRefreshTrigger = () => {
    const msBefore = 240000;
    const setTimer = (onTrigger: () => void) => {
      if (timer.current !== undefined) {
        clearTimeout(timer.current);
      }
      const delta = getTimeToExpiry();
      if (delta < msBefore) {
        onTrigger();
        return;
      }
      const waitFor = delta - msBefore;
      timer.current = setTimeout(onTrigger, waitFor);
    };
    setTimer(refreshToken);
  };

  const setup = () => {
    const isLoggedIn = isStoredJWTValid();
    const userID = getUserID();
    const ben = isBeneficiaryUser();
    const org = getOrganisation();
    if (stateUser.loggedIn !== isLoggedIn || stateUser.userID !== userID) {
      setUser(isLoggedIn, userID, ben);
    }
    if (isLoggedIn === false && isPublicPage(location.pathname) === false) {
      sendToLogin();
      return;
    }
    if (isLoggedIn && !org && !ben && !isPublicPage(location.pathname)) {
      sendToNoOrgPage();
    }
    setupRefreshTrigger();
    if (stateUser.logOutRequest !== undefined) {
      clearAuth();
      webAuth.current.logout(getLogoutOptions(stateUser.logOutRequest));
    }
  };

  return <div>{stateUser.loggedIn && p.children}</div>;
};
