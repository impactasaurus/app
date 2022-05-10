import { timeToExpiry } from "helpers/auth";
import useInterval from "helpers/hooks/useInterval";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLogout, useSession } from "redux/modules/user";
import { Button } from "semantic-ui-react";

const secondsToExpiry = (expiry: Date) =>
  Math.floor(timeToExpiry(expiry) / 1000);

export const RefreshFailedToast = (): JSX.Element => {
  const { t } = useTranslation();
  const { expiry } = useSession();
  const logout = useLogout();
  const [secondsLeft, setSecondsLeft] = useState(secondsToExpiry(expiry));

  useInterval(() => {
    setSecondsLeft(secondsToExpiry(expiry));
  }, 1000);

  return (
    <div>
      <div style={{ marginBottom: "0.6em" }}>
        {t(
          "Your session will expire in {x} seconds, you will need to log in again",
          {
            x: secondsLeft,
          }
        )}
      </div>
      <Button compact={true} primary={true} onClick={() => logout()}>
        {t("Log in")}
      </Button>
    </div>
  );
};

export const SuccessToast = (): JSX.Element => {
  const { t } = useTranslation();
  return <span>{t("Successfully refreshed your session")}</span>;
};
