import React, { useEffect, useRef } from "react";
import { getLogoutOptions, getWebAuth } from "helpers/auth";
import { useSetJWT, useUser } from "redux/modules/user";
import { WebAuth } from "auth0-js";

export const LogOutListener = (): JSX.Element => {
  const webAuth = useRef<WebAuth>(getWebAuth());
  const { logOutRequest } = useUser();
  const setJWT = useSetJWT();

  useEffect(() => {
    if (logOutRequest !== undefined) {
      setJWT(null);
      webAuth.current.logout(getLogoutOptions(logOutRequest));
    }
  }, [logOutRequest]);

  return <div />;
};
