import { TourPointer } from "components/TourPointer";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { TourStage, tourStageAction } from "redux/modules/tour";
import { TourContainer } from "components/TourContainer";
import { Button, Segment } from "semantic-ui-react";
import RocketIcon from "./../../theme/rocket.inline.svg";
import { useDispatch } from "react-redux";
import ReactGA from "react-ga4";

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
      transitionOnUnmount={TourStage.QUESTIONNAIRE_4}
    />
  );
};

export const WhatNextAfterQuestionnaireTour = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onClick = () => {
    ReactGA.event({
      category: "tour",
      label: "record",
      action: "started-whats-next",
    });
    dispatch(tourStageAction(TourStage.RECORD_1));
  };

  return (
    <TourContainer stage={TourStage.QUESTIONNAIRE_4} transitionOnUnmount={null}>
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
          {t("Nice one, the questionnaire has been added to your organisation")}
        </p>
        <p>
          {t(
            "Let's imitate a beneficiary and answer the questions, creating your first record"
          )}
        </p>
        <Button primary={true} onClick={onClick}>
          {t("New Record")}
        </Button>
      </Segment>
    </TourContainer>
  );
};
