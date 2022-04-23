import React, { useEffect, useRef } from "react";
import { refreshToken, timeToExpiry } from "helpers/auth";
import { useSetJWT, useUser } from "redux/modules/user";
import ReactGA from "react-ga";

export const TokenRefresher = (): JSX.Element => {
  const setJWT = useSetJWT();
  const user = useUser();
  const timer = useRef<number>();

  useEffect(() => {
    setupRefreshTrigger();
  }, [user]);

  const refresh = () => {
    refreshToken()
      .then((token) => {
        setJWT(token);
        ReactGA.event({
          category: "silent_auth",
          action: "success",
        });
      })
      .catch((err) => {
        console.error(err.description);
        ReactGA.event({
          category: "silent_auth",
          action: "failed",
          label: err.description,
        });
      });
  };

  const setupRefreshTrigger = () => {
    const msBefore = 240000;
    const setTimer = (onTrigger: () => void) => {
      if (timer.current !== undefined) {
        clearTimeout(timer.current);
      }
      const delta = timeToExpiry(user.expiry);
      if (delta < msBefore) {
        onTrigger();
        return;
      }
      const waitFor = delta - msBefore;
      timer.current = window.setTimeout(onTrigger, waitFor);
    };
    setTimer(refresh);
  };

  return <div />;
};
