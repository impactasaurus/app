import React, { useEffect, useRef } from "react";
import { getLogoutOptions, getWebAuth } from "helpers/auth";
import { useSession, useSetJWT } from "redux/modules/user";
import { WebAuth } from "auth0-js";

export const LogOutListener = (): JSX.Element => {
  const webAuth = useRef<WebAuth>(getWebAuth());
  const { logOutRequest } = useSession();
  const setJWT = useSetJWT();

  useEffect(() => {
    if (logOutRequest !== undefined) {
      setJWT(null);
      webAuth.current.logout(getLogoutOptions(logOutRequest));
    }
  }, [logOutRequest]);

  return <div />;
};
