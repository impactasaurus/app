import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSetJWT } from "redux/modules/user";

export const Thanks = (): JSX.Element => {
  const { t } = useTranslation();
  const setJWT = useSetJWT();

  useEffect(() => {
    // log the beneficiary out once the record is complete
    setJWT(null);
  }, []);

  return (
    <div>
      <h1>{t("Thank you")}</h1>
      <span>{t("We have successfully saved your answers")}</span>
    </div>
  );
};
