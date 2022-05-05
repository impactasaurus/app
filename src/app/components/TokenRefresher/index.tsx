import React, { useEffect, useRef } from "react";
import { refreshToken, REFRESH_TRIGGER_MS, timeToExpiry } from "helpers/auth";
import {
  useHydrateJWT,
  useSession,
  useSetJWT,
  useUser,
} from "redux/modules/user";

const TRIGGER_FREQ = 5 * 1000;
const REFRESH_COOL_OFF = REFRESH_TRIGGER_MS / 10;

export const TokenRefresher = (): JSX.Element => {
  const setJWT = useSetJWT();
  const hydrateJWT = useHydrateJWT();
  const { loggedIn } = useUser();
  const { expiry } = useSession();
  const refreshing = useRef<boolean>(false);
  const lastRefreshAttempt = useRef<number>(0);

  useEffect(() => {
    window.setInterval(trigger, TRIGGER_FREQ);
  }, []);

  useEffect(() => {
    trigger();
  }, [expiry]);

  const refresh = (): Promise<void> => {
    if (refreshing.current) {
      return Promise.resolve();
    }
    refreshing.current = true;
    lastRefreshAttempt.current = Date.now();
    return refreshToken()
      .then((token) => {
        setJWT(token);
        refreshing.current = false;
      })
      .catch((err) => {
        console.error(err.description);
        refreshing.current = false;
      });
  };

  const trigger = () => {
    const delta = timeToExpiry(expiry);

    if (delta < 0 && loggedIn) {
      // hydrate the current JWT:
      // if we failed to refresh, we will ensure the hydrated state reflects the expired token
      // if we successfully refreshed, we are just duplicating a little hydration effort
      // catch should never fire, but just in case
      refresh().then(hydrateJWT).catch(hydrateJWT);
    } else if (delta > 0 && delta < REFRESH_TRIGGER_MS) {
      const timeSinceLastTry = Date.now() - lastRefreshAttempt.current;
      if (delta < 60 * 1000 || timeSinceLastTry > REFRESH_COOL_OFF) {
        refresh();
      }
    }
  };

  return <div />;
};
