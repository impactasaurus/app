import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import React from "react";
import { useTranslation } from "react-i18next";
import { Message } from "semantic-ui-react";

const BeneficiaryBlockerInner = (): JSX.Element => {
  const { t } = useTranslation();
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
