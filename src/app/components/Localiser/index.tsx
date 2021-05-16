import React, { useEffect } from "react";
import { IGetSelf, getSelf } from "apollo/modules/user";
import { useTranslation } from "react-i18next";
import moment from "moment";

interface IProps {
  self?: IGetSelf;
}

const Inner = (p: IProps) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (
      !p.self.loading &&
      !p.self.error &&
      p.self.getSelf &&
      p.self.getSelf.settings
    ) {
      const lng = p.self.getSelf.settings.language;
      let prom;
      if (lng && lng !== "und") {
        prom = i18n.changeLanguage(lng);
      } else {
        // use language detector
        prom = i18n.changeLanguage();
      }
      prom.finally(() => {
        const lan = i18n.language === "tlh" ? "x-pseudo" : i18n.language;
        moment.locale(lan);
      });
    }
  }, [p.self]);

  return <div />;
};

export const Localiser = getSelf(Inner, "self");
