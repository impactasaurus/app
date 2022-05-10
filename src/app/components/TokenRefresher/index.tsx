import React, { useEffect, useRef } from "react";
import { refreshToken, REFRESH_TRIGGER_MS, timeToExpiry } from "helpers/auth";
import {
  useHydrateJWT,
  useSession,
  useSetJWT,
  useUser,
} from "redux/modules/user";
import toast from "react-hot-toast";
import { RefreshFailedToast, SuccessToast } from "./toast";
import useInterval from "helpers/hooks/useInterval";

const TRIGGER_FREQ = 5 * 1000;

const SHOW_TOAST = 60 * 1000;
const TOAST_ID = "refresh-expiry-soon";

const REFRESH_COOL_OFF = REFRESH_TRIGGER_MS / 10;
const RAPID_REFRESH = SHOW_TOAST * 2;
const RAPID_REFRESH_COOL_OFF = RAPID_REFRESH / 6;

export const TokenRefresher = (): JSX.Element => {
  const setJWT = useSetJWT();
  const hydrateJWT = useHydrateJWT();
  const { loggedIn } = useUser();
  const { expiry } = useSession();
  const refreshing = useRef<boolean>(false);
  const lastRefreshAttempt = useRef<number>(0);
  const toastActive = useRef<boolean>(false);

  useInterval(() => trigger(), TRIGGER_FREQ);
  useEffect(() => trigger(), [expiry]);

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

  const triggerRefresh = (delta: number) => {
    if (delta < 0 && loggedIn) {
      // hydrate the current JWT:
      // if we failed to refresh, we will ensure the hydrated state reflects the expired token
      // if we successfully refreshed, we are just duplicating a little hydration effort
      // catch should never fire, but just in case
      refresh().then(hydrateJWT).catch(hydrateJWT);
    } else if (delta > 0 && delta < REFRESH_TRIGGER_MS) {
      const timeSinceLastTry = Date.now() - lastRefreshAttempt.current;
      const cooledOff = timeSinceLastTry > REFRESH_COOL_OFF;
      const rapidlyCool =
        delta < RAPID_REFRESH && timeSinceLastTry > RAPID_REFRESH_COOL_OFF;
      if (rapidlyCool || cooledOff) {
        refresh();
      }
    }
  };

  const triggerToast = (delta: number) => {
    if (delta <= SHOW_TOAST && !toastActive.current) {
      toastActive.current = true;
      toast(<RefreshFailedToast />, {
        duration: delta + 1000,
        id: TOAST_ID,
      });
    } else if (delta > SHOW_TOAST && toastActive.current) {
      toastActive.current = false;
      toast.success(<SuccessToast />, {
        duration: 2000,
        id: TOAST_ID,
      });
    }
  };

  const trigger = () => {
    const delta = timeToExpiry(expiry);
    triggerRefresh(delta);
    triggerToast(delta);
  };

  return <div />;
};
