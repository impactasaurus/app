import React from "react";
import { useTranslation } from "react-i18next";
import { useLogout } from "redux/modules/user";
import { Button } from "semantic-ui-react";

export const RefreshFailedToast = (): JSX.Element => {
  const { t } = useTranslation();
  const logout = useLogout();

  return (
    <div>
      <div style={{ marginBottom: "0.6em" }}>
        {t("Your session is about to expire")}
      </div>
      <Button compact={true} primary={true} onClick={() => logout()}>
        {t("Reauthenticate")}
      </Button>
    </div>
  );
};

export const SuccessToast = (): JSX.Element => {
  const { t } = useTranslation();
  return <span>{t("Successfully refreshed your session")}</span>;
};
