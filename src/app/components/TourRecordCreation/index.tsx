import * as React from "react";
import { TourPointer } from "components/TourPointer";
import { useTranslation } from "react-i18next";
import { TourStage } from "redux/modules/tour";
import { TourContainer } from "components/TourContainer";
import { Button, Segment } from "semantic-ui-react";
import RocketIcon from "./../../theme/rocket.inline.svg";

interface IProps {
  id: string;
}

export const IntroduceNewRecordButton = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourPointer
      steps={[
        {
          content: t("Click the plus button to create a record"),
          target: `#${p.id}`,
        },
      ]}
      stage={TourStage.RECORD_1}
      transitionOnLocationChange={TourStage.RECORD_2}
    />
  );
};

export const IntroduceAnswerGatheringOptions = (p: {
  remoteID: string;
  historicID: string;
  liveID: string;
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourPointer
      stage={TourStage.RECORD_2}
      transitionOnUnmount={TourStage.RECORD_3}
      steps={[
        {
          content: t("You can collect questionnaire responses remotely..."),
          target: `#${p.remoteID}`,
          spotlightClickThrough: false,
        },
        {
          content: t("quickly enter answers gathered offline..."),
          target: `#${p.historicID}`,
          spotlightClickThrough: false,
        },
        {
          content: t(
            "or complete them with your beneficiary. Let's select this option"
          ),
          target: `#${p.liveID}`,
        },
      ]}
    />
  );
};

export const IntroduceNewRecordForm = (p: {
  benInputID: string;
  questionnaireInputID: string;
  submitButtonID: string;
  isBenComplete: boolean;
  isQuestionnaireSelected: boolean;
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourPointer
      stage={TourStage.RECORD_3}
      transitionOnUnmount={TourStage.RECORD_4}
      steps={[
        {
          content: t(
            "We first need to define which beneficiary is answering the questionnaire, this is done with a unique identifier. The ID used will depend on your organisation, but for now let's go with something easy like Ben1"
          ),
          target: `#${p.benInputID}`,
          isComplete: p.isBenComplete,
        },
        {
          content: t(
            "Here we select the questionnaire we want the beneficiary to answer - select the ONS questionnaire we set up earlier"
          ),
          target: `#${p.questionnaireInputID}`,
          isComplete: p.isQuestionnaireSelected,
        },
        {
          content: t(
            "That's all we need for now. When you click start, the questionnaire can be answered; provide answers to the four questions and we can continue once completed"
          ),
          target: `#${p.submitButtonID}`,
        },
      ]}
    />
  );
};

export const IntroduceBenPage = (p: {
  visContainerID: string;
  newRecordButtonID: string;
  benID: string;
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourPointer
      stage={TourStage.RECORD_4}
      transitionOnUnmount={TourStage.RECORD_5}
      steps={[
        {
          target: `#${p.visContainerID}`,
          content: t(
            "This is the beneficiary page for {name}, it collects all of their records into a single place. In this radar chart you can see the data you just entered",
            {
              name: p.benID,
            }
          ),
          disableScrolling: true,
        },
        {
          target: `#${p.newRecordButtonID}`,
          content: t(
            "Impactasaurus is designed for distance travelled analysis, so let's quickly answer the questionnaire again for this beneficiary"
          ),
        },
      ]}
    />
  );
};

export const IntroduceDataEntry = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourPointer
      stage={TourStage.RECORD_5}
      transitionOnUnmount={TourStage.RECORD_6}
      steps={[
        {
          content: t(
            "this time let's use the data entry option to quickly enter in our answers"
          ),
          target: `#${p.id}`,
        },
      ]}
    />
  );
};

export const IntroduceDataEntryForm = (p: {
  dateSelectID: string;
  submitButtonID: string;
  isDateSelectionComplete: boolean;
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourPointer
      stage={TourStage.RECORD_6}
      transitionOnUnmount={TourStage.RECORD_7}
      steps={[
        {
          content: t(
            "Using the data entry mode, we can enter in data collected historically. Select a date before today"
          ),
          target: `#${p.dateSelectID}`,
          isComplete: p.isDateSelectionComplete,
          disableOverlay: true,
        },
        {
          content: t(
            "The data entry mode makes it much quicker to provide answers, give it a try"
          ),
          target: `#${p.submitButtonID}`,
          disableOverlay: true,
        },
      ]}
    />
  );
};

export const WhatNextAfterNewRecordTour = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <TourContainer stage={TourStage.RECORD_7} transitionOnUnmount={null}>
      <Segment
        key="quickStart"
        id="quick-start"
        raised={true}
        compact={true}
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        <h3 style={{ fontWeight: "normal" }}>
          <RocketIcon style={{ width: "1rem", marginRight: ".3rem" }} />
          {t("What next?")}
        </h3>
        <p>
          {t(
            "The radar chart below now shows both sets of answers, highlighting the differences over time."
          )}
        </p>
        <p>
          {t(
            "Now we have some data, we can look at the reporting functionality - click below for the tour."
          )}
        </p>
        <Button primary={true}>{t("Generate a Report")}</Button>
      </Segment>
    </TourContainer>
  );
};
