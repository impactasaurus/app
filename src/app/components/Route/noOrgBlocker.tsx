import React, { useEffect } from "react";
import { CustomError } from "components/Error";
import { useTranslation } from "react-i18next";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import ReactGA from "react-ga";

const NoOrgBlockerInner = (): JSX.Element => {
  const { t } = useTranslation();

  useEffect(() => {
    ReactGA.event({
      category: "route",
      action: "blocked",
      label: "noOrgBlocker",
    });
  }, []);

  return (
    <CustomError
      inner={
        <>
          <div>
            <b>{t("Sorry, it seems you do not belong to an organisation.")}</b>
          </div>
          <div>
            {t(
              "If you have an invitation, please follow the link to accept the invitation."
            )}
          </div>
          <div>
            {t(
              "If you would like to create an organisation or this is unexpected, please contact support."
            )}
          </div>
        </>
      }
    />
  );
};

export const NoOrgBlocker = MinimalPageWrapperHoC(
  "No Organisation",
  "no-org-error",
  NoOrgBlockerInner
);
