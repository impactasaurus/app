import React, { useEffect, useState } from "react";
import { SummonForm } from "./form";
import { useNavigator } from "redux/modules/url";
import { ISummonAcceptanceMutation } from "apollo/modules/summon";
import { newMeetingFromSummon } from "../../apollo/modules/summon";
import { PageWrapperHoC } from "../../components/PageWrapperHoC";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { Loader } from "semantic-ui-react";
import { CustomError } from "components/Error";
import { Decode } from "helpers/summon";

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
  const [idNeeded, setIDNeeded] = useState(false);
  const [error, setError] = useState<Error>(undefined);

  useEffect(() => {
    try {
      const { id, ben } = Decode(p.match.params.id);
      if (ben) {
        createRecord(ben, id).catch((e) => {
          setError(e);
        });
      } else {
        setIDNeeded(true);
      }
    } catch (e) {
      setError(
        new Error(
          t("We did not recognise this link. Please request a new link")
        )
      );
    }
  }, []);

  const logResult = (label: string) => {
    ReactGA.event({
      category: "summon",
      action: "acceptance",
      label,
    });
  };

  const createRecord = (
    beneficiaryID: string,
    summonID?: string
  ): Promise<void> => {
    return p
      .newMeetingFromSummon(summonID ?? p.match.params.id, beneficiaryID)
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
        } else if (
          e.message.includes("found") ||
          e.message.includes("no documents")
        ) {
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

  if (idNeeded) {
    return <SummonForm onBeneficiarySelect={createRecord} />;
  } else if (error) {
    return <CustomError inner={<span>{error.message}</span>} />;
  } else {
    return <Loader active={true} inline="centered" />;
  }
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
