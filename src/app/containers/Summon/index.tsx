import * as React from "react";
import { SummonForm } from "./form";
import { useNavigator } from "redux/modules/url";
import { ISummonAcceptanceMutation } from "apollo/modules/summon";
import { newMeetingFromSummon } from "../../apollo/modules/summon";
import { PageWrapperHoC } from "../../components/PageWrapperHoC";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";

interface IProps extends ISummonAcceptanceMutation {
  match: {
    params: {
      id: string;
    };
  };
}

const SummonAcceptanceInner = (p: IProps) => {
  const { t } = useTranslation();
  const setURL = useNavigator();

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
        setURL(`/jti/${jti}`);
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
  return <SummonForm onBeneficiarySelect={createRecord} />;
};

const SummonAcceptanceData = newMeetingFromSummon<IProps>(
  SummonAcceptanceInner
);
// t("Welcome")
export const SummonAcceptance = PageWrapperHoC<IProps>(
  "Welcome",
  "summonAcceptance",
  SummonAcceptanceData
);
