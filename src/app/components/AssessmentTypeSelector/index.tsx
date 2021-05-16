import * as React from "react";
import { AssessmentType, defaultRemoteMeetingLimit } from "models/assessment";
import { Item, MultiChoice } from "../MultiChoice";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import "./style.less";

interface IProps {
  typeSelector: (selected: AssessmentType) => void;
}

const AssessmentTypeSelector = (p: IProps): JSX.Element => {
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

  const { t } = useTranslation();
  const items: Item[] = [
    {
      title: t("Live"),
      subtitle: t("Complete together"),
      description: t("Complete the questionnaire together"),
      onClick: typeClickFn(AssessmentType.live),
    },
    {
      title: t("Remote"),
      subtitle: t("Send a link"),
      description: t(
        `Generates a link that you can send to the beneficiary to complete on their own. The link will be valid for {noDays} days`,
        { noDays: defaultRemoteMeetingLimit }
      ),
      onClick: typeClickFn(AssessmentType.remote),
    },
    {
      title: t("Data Entry"),
      subtitle: t("Enter historic data"),
      description: t(
        `Enter data gathered historically into the system. For example, if you completed the questionnaire on paper with the beneficiary`
      ),
      onClick: typeClickFn(AssessmentType.historic),
    },
  ];

  return <MultiChoice items={items} />;
};

export { AssessmentTypeSelector };
