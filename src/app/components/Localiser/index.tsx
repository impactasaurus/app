import React, { useEffect } from "react";
import { IGetSelf, getSelf } from "apollo/modules/user";
import { useTranslation } from "react-i18next";
import { setPref, SetPrefFunc } from "redux/modules/pref";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";

export const LOCALE_PREF_KEY = "locale";

interface IProps {
  self?: IGetSelf;
  setPref: SetPrefFunc;
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
        const lan = i18n.language;
        moment.locale(lan);
        p.setPref(LOCALE_PREF_KEY, lan);
      });
    }
  }, [p.self]);
  return <div />;
};

const dispatchToProps = (dispatch) => ({
  setPref: bindActionCreators(setPref, dispatch),
});

const ConnectedInner = connect(undefined, dispatchToProps)(Inner);

export const Localiser = getSelf(ConnectedInner, "self");
