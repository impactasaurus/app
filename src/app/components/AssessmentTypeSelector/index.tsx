import * as React from "react";
import { AssessmentType, defaultRemoteMeetingLimit } from "models/assessment";
import { Item, MultiChoice } from "../MultiChoice";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import "./style.less";
import {
  IntroduceAnswerGatheringOptions,
  IntroduceDataEntry,
} from "components/TourRecordCreation";

interface IProps {
  typeSelector: (selected: AssessmentType) => void;
}

const LiveID = "live-new-record";
const RemoteID = "remote-new-record";
const HistoricID = "historic-new-record";

const AssessmentTypeSelector = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const typeClickFn = (t: AssessmentType): (() => void) => {
    return () => {
      ReactGA.event({
        category: "assessment",
        action: "typeSelected",
        label: AssessmentType[t],
      });
      p.typeSelector(t);
    };
  };

  const items: Item[] = [
    {
      title: t("Live"),
      subtitle: t("Complete together"),
      description: t("Complete the questionnaire together"),
      onClick: typeClickFn(AssessmentType.live),
      id: LiveID,
    },
    {
      title: t("Remote"),
      subtitle: t("Send a link"),
      description: t(
        `Generates a link that you can send to the beneficiary to complete on their own. The link will be valid for {noDays} days`,
        { noDays: defaultRemoteMeetingLimit }
      ),
      onClick: typeClickFn(AssessmentType.remote),
      id: RemoteID,
    },
    {
      title: t("Data Entry"),
      subtitle: t("Enter historic data"),
      description: t(
        `Enter data gathered historically into the system. For example, if you completed the questionnaire on paper with the beneficiary`
      ),
      onClick: typeClickFn(AssessmentType.historic),
      id: HistoricID,
    },
  ];

  return (
    <>
      <MultiChoice items={items} />
      <IntroduceAnswerGatheringOptions
        remoteID={RemoteID}
        historicID={HistoricID}
        liveID={LiveID}
      />
      <IntroduceDataEntry id={HistoricID} />
    </>
  );
};

export { AssessmentTypeSelector };
