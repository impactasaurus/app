import React, { useEffect, useRef } from "react";
import { refreshToken, timeToExpiry } from "helpers/auth";
import { useJWT, useSession, useSetJWT, useUser } from "redux/modules/user";

const REFRESH_DELTA = 4 * 60 * 1000;
const TRIGGER_FREQ = 5 * 1000;

export const TokenRefresher = (): JSX.Element => {
  const setJWT = useSetJWT();
  const { loggedIn } = useUser();
  const { expiry } = useSession();
  const JWT = useJWT();
  const refreshing = useRef<boolean>(false);

  useEffect(() => {
    window.setInterval(trigger, TRIGGER_FREQ);
  }, []);

  useEffect(() => {
    trigger();
  }, [expiry]);

  const refresh = () => {
    if (refreshing.current) {
      return;
    }
    refreshing.current = true;
    refreshToken()
      .then((token) => {
        setJWT(token);
        refreshing.current = false;
      })
      .catch((err) => {
        console.error(err.description);
        refreshing.current = false;
      });
  };

  const resetJWT = () => {
    setJWT(JWT);
  };

  const trigger = () => {
    const delta = timeToExpiry(expiry);

    if (delta < 0 && loggedIn) {
      resetJWT();
    }
    if (delta > 0 && delta < REFRESH_DELTA) {
      refresh();
    }
  };

  return <div />;
};
