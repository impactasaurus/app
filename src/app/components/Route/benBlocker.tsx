import React, { useEffect } from "react";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { useTranslation } from "react-i18next";
import { Message } from "semantic-ui-react";
import ReactGA from "react-ga";

const BeneficiaryBlockerInner = (): JSX.Element => {
  const { t } = useTranslation();

  useEffect(() => {
    ReactGA.event({
      category: "route",
      action: "blocked",
      label: "benBlocker",
    });
  }, []);

  return (
    <Message error={true}>
      <Message.Header>{t("Sorry")}</Message.Header>
      <p>{t("Beneficiaries aren't allowed to access this page")}</p>
      <p>
        {t(
          "If you have an Impactasaurus account, please log out and log back in"
        )}
      </p>
    </Message>
  );
};

export const BeneficiaryBlocker = MinimalPageWrapperHoC(
  "No Access",
  "beneficiary-blocker",
  BeneficiaryBlockerInner
);
