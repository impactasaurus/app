import React from "react";
import { useTranslation } from "react-i18next";
import { PageWrapperHoC } from "components/PageWrapperHoC";

const Inner = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div>
      <p>
        {t(
          "Thank you for supporting the running and development of Impactasaurus"
        )}
      </p>
      <p>
        {t("We will be in touch within 24 hours to discuss custom branding")}
      </p>
    </div>
  );
};

// t("Thanks!")
export const PatronSuccess = PageWrapperHoC("Thanks!", "patron-success", Inner);
