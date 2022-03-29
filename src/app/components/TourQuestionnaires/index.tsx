import { TourPointer } from "components/TourPointer";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { TourStage } from "redux/modules/tour";

interface IProps {
  id: string;
}

export const IntroduceQuestionnairePage = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourPointer
      steps={[
        {
          content: t(
            "Let's head to the questionnaire page - your organisation's questionnaires are stored here"
          ),
          target: `#${p.id}`,
        },
      ]}
      stage={TourStage.QUESTIONNAIRE_1}
      transitionOnLocationChange={TourStage.QUESTIONNAIRE_2}
    />
  );
};

export const IntroduceNewQuestionnaireButton = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourPointer
      steps={[
        {
          content: t("Click here to create a questionnaire"),
          target: `#${p.id}`,
        },
      ]}
      stage={TourStage.QUESTIONNAIRE_2}
      transitionOnUnmount={TourStage.QUESTIONNAIRE_3}
    />
  );
};

export const IntroduceQuestionnaireCreation = (p: {
  quickStartID: string;
  otherOptionsID: string;
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourPointer
      steps={[
        {
          content: t(
            "You can create your own questionnaires or select from our catalogue, but for now..."
          ),
          target: `#${p.otherOptionsID}`,
          spotlightClickThrough: false,
        },
        {
          content: t(
            "let's import the ONS questionnaire, which is a simple questionnaire on wellbeing - great for experimenting with"
          ),
          target: `#${p.quickStartID}`,
        },
      ]}
      stage={TourStage.QUESTIONNAIRE_3}
      transitionOnUnmount={null}
    />
  );
};
