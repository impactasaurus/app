import * as React from "react";
import {
  isUserLoggedIn,
  isBeneficiaryUser as isCurrentUserABeneficiary,
} from "redux/modules/user";
import { IStore } from "redux/IStore";
import { LoggedInUserConfirmation } from "components/LogoutConfirmation";
import { SummonForm } from "./form";
import { IURLConnector, UrlConnector } from "redux/modules/url";
import { ISummonAcceptanceMutation } from "apollo/modules/summon";
import { newMeetingFromSummon } from "../../apollo/modules/summon";
import { PageWrapperHoC } from "../../components/PageWrapperHoC";
import { connect } from "react-redux";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";

interface IProps extends IURLConnector, ISummonAcceptanceMutation {
  match: {
    params: {
      id: string;
    };
  };
  isLoggedIn?: boolean;
  isBeneficiary?: boolean;
}

const SummonAcceptanceInner = (p: IProps) => {
  const { t } = useTranslation();

  const logResult = (label: string) => {
    ReactGA.event({
      category: "summon",
      action: "acceptance",
      label,
    });
  };

  const createRecord = (beneficiaryID: string): Promise<void> => {
    return p
      .newMeetingFromSummon(p.match.params.id, beneficiaryID)
      .then((jti) => {
        logResult("success");
        p.setURL(`/jti/${jti}`);
      })
      .catch((e: Error) => {
        logResult(e.message);
        if (e.message.includes("expired")) {
          throw new Error(
            t("This link has expired. Please request a new link")
          );
        } else if (e.message.includes("exhausted")) {
          throw new Error(
            t("This link has been exhausted. Please request a new link")
          );
        } else if (e.message.includes("found")) {
          throw new Error(
            t("We did not recognise this link. Please request a new link")
          );
        } else {
          const e1 = t("Loading questionnaire failed.");
          const e2 = t(
            "Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org"
          );
          throw new Error(`${e1} ${e2}`);
        }
      });
  };

  if (p.isLoggedIn && !p.isBeneficiary) {
    return <LoggedInUserConfirmation />;
  }
  return <SummonForm onBeneficiarySelect={createRecord} />;
};

const storeToProps = (state: IStore) => ({
  isLoggedIn: isUserLoggedIn(state.user),
  isBeneficiary: isCurrentUserABeneficiary(state.user),
});

const SummonAcceptanceConnected = connect(
  storeToProps,
  UrlConnector
)(SummonAcceptanceInner);
const SummonAcceptanceData = newMeetingFromSummon<IProps>(
  SummonAcceptanceConnected
);
// t("Welcome")
export const SummonAcceptance = PageWrapperHoC<IProps>(
  "Welcome",
  "summonAcceptance",
  SummonAcceptanceData
);
