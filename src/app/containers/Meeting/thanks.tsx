import React from "react";
import { useTranslation } from "react-i18next";

export const Thanks = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("Thank you")}</h1>
      <span>{t("We have successfully saved your answers")}</span>
    </div>
  );
};
