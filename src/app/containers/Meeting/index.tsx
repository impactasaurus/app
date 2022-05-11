import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { IMeetingResult, getMeeting } from "apollo/modules/meetings";
import { Question } from "components/Question";
import { Grid, Loader, Progress } from "semantic-ui-react";
import { useNavigator } from "redux/modules/url";
import { Error } from "components/Error";
import { QuestionnaireReview } from "components/QuestionnaireReview";
import { QuestionnaireInstructions } from "components/QuestionnaireInstructions";
import { MeetingNotepad } from "components/MeetingNotepad";
import {
  Screen,
  IMeetingState,
  getPreviousState,
  canGoBack,
  getNextState,
  initialState,
} from "./state-machine";
import { journey } from "helpers/url";
import { Thanks } from "./thanks";
import { EmptyQuestionnaire } from "containers/Meeting/empty";
import { useTranslation } from "react-i18next";
import ReactGA from "react-ga";
import { useUser } from "redux/modules/user";
import { getQuestions } from "helpers/questionnaire";
import "rc-slider/assets/index.css";
import "./style.less";
import { IOutcomeSet } from "models/outcomeSet";
import { IQuestion } from "models/question";

interface IProps {
  data: IMeetingResult;
  match: {
    params: {
      id: string;
    };
  };
}

const Wrapper = (p: {
  children: JSX.Element;
  progress?: JSX.Element;
}): JSX.Element => {
  const { children, progress = <div /> } = p;
  const { t } = useTranslation();
  return (
    <div id="meeting">
      {progress}
      <Grid container={true} columns={1}>
        <Grid.Column>
          <Helmet>
            <title>{t("Questionnaire")}</title>
          </Helmet>
          <div>{children}</div>
        </Grid.Column>
      </Grid>
    </div>
  );
};

const hasInstructions = (q: IOutcomeSet) =>
  q.instructions && q.instructions.length !== 0;
const questionIdx = (qId: string, questions: IQuestion[]): number =>
  questions.findIndex((q) => q.id === qId);

const MeetingInner = (p: IProps) => {
  const [currentQuestionID, setCurrentQuestionID] = useState<string>();
  const [screen, setScreen] = useState<Screen>(Screen.QUESTION);
  const { beneficiaryUser } = useUser();
  const init = useRef<boolean>(false);
  const { t } = useTranslation();
  const setURL = useNavigator();

  const questionnaire = p.data?.getMeeting?.outcomeSet;
  const questions = questionnaire ? getQuestions(questionnaire) : undefined;

  useEffect(() => {
    if (!init.current && questions) {
      init.current = true;
      const iState = initialState(
        hasInstructions(questionnaire),
        questions.length
      );
      setMeetingState(iState);
    }
  }, [questions]);

  const setMeetingState = (s: IMeetingState) => {
    setScreen(s.screen);
    let idxx = s.qIdx;
    if (idxx < 0) {
      idxx = 0;
    }
    if (idxx >= questions.length) {
      idxx = questions.length - 1;
    }
    const question = questions[idxx];
    if (question !== undefined) {
      setCurrentQuestionID(question.id);
    }
  };

  const goToQuestionWithID = (qID: string) => {
    const idx = questions.findIndex((q) => q.id === qID);
    setMeetingState({
      screen: Screen.QUESTION,
      qIdx: idx,
    });
  };

  const completed = () => {
    ReactGA.event({
      category: "assessment",
      action: "completed",
    });
    if (beneficiaryUser) {
      setMeetingState({
        screen: Screen.THANKS,
        qIdx: questionIdx(currentQuestionID, questions),
      });
    } else {
      journey(
        setURL,
        p.data.getMeeting.beneficiary,
        p.data.getMeeting.outcomeSetID
      );
    }
  };

  const goToNextScreen = () => {
    const nextState = getNextState(
      screen,
      questionIdx(currentQuestionID, questions),
      questions.length
    );
    setMeetingState(nextState);
  };

  const goToPreviousScreen = () => {
    const prevState = getPreviousState(
      screen,
      questionIdx(currentQuestionID, questions),
      hasInstructions(questionnaire)
    );
    setMeetingState(prevState);
  };

  const canGoToPrevious = (): boolean => {
    return canGoBack(
      screen,
      questionIdx(currentQuestionID, questions),
      hasInstructions(questionnaire)
    );
  };

  const ProgressBar = (): JSX.Element => {
    let value = questionIdx(currentQuestionID, questions);
    if (screen === Screen.NOTES || screen === Screen.REVIEW) {
      value = questions.length;
    }
    return <Progress value={value} total={questions.length} size="tiny" />;
  };

  const { data } = p;
  if (data.error) {
    return (
      <Wrapper>
        <Error text={t("Failed to load")} />
      </Wrapper>
    );
  }
  if (data.loading || data.getMeeting === undefined) {
    return (
      <Wrapper>
        <Loader active={true} inline="centered" />
      </Wrapper>
    );
  }
  if (screen === Screen.REVIEW) {
    return (
      <Wrapper progress={<ProgressBar />}>
        <QuestionnaireReview
          record={p.data.getMeeting}
          onQuestionClick={goToQuestionWithID}
          onBack={goToPreviousScreen}
          onComplete={completed}
        />
      </Wrapper>
    );
  }
  if (screen === Screen.NOTES) {
    return (
      <Wrapper progress={<ProgressBar />}>
        <MeetingNotepad
          record={p.data.getMeeting}
          onComplete={goToNextScreen}
          onBack={goToPreviousScreen}
        />
      </Wrapper>
    );
  }
  if (screen === Screen.INSTRUCTIONS) {
    return (
      <Wrapper progress={<ProgressBar />}>
        <QuestionnaireInstructions
          title={questionnaire.name}
          text={questionnaire.instructions}
          onNext={goToNextScreen}
        />
      </Wrapper>
    );
  }
  if (screen === Screen.THANKS) {
    return (
      <Wrapper>
        <Thanks />
      </Wrapper>
    );
  }
  if (screen === Screen.EMPTY) {
    return (
      <Wrapper>
        <EmptyQuestionnaire
          questionnaireID={questionnaire.id}
          isBeneficiary={beneficiaryUser}
        />
      </Wrapper>
    );
  }
  if (currentQuestionID === undefined) {
    return (
      <Wrapper>
        <Loader active={true} inline="centered" />
      </Wrapper>
    );
  }

  return (
    <Wrapper progress={<ProgressBar />}>
      <Question
        key={currentQuestionID}
        record={data.getMeeting}
        questionID={currentQuestionID}
        showPrevious={canGoToPrevious()}
        onPrevious={goToPreviousScreen}
        onNext={goToNextScreen}
      />
    </Wrapper>
  );
};

const Meeting = getMeeting<IProps>((props) => props.match.params.id)(
  MeetingInner
);
export { Meeting };
