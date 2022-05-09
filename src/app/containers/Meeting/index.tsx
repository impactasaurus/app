import React, { useState, useEffect } from "react";
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

interface IProps {
  data: IMeetingResult;
  match: {
    params: {
      id: string;
    };
  };
}

const MeetingInner = (p: IProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<string>();
  const [screen, setScreen] = useState<Screen>(Screen.QUESTION);
  const [init, setInit] = useState<boolean>(false);
  const { t } = useTranslation();
  const setURL = useNavigator();
  const { beneficiaryUser } = useUser();

  const questionnaire = p.data?.getMeeting?.outcomeSet;
  const questions = questionnaire ? getQuestions(questionnaire) : undefined;

  useEffect(() => {
    if (!init && questions) {
      setInit(true);
      setMeetingState(initialState(hasInstructions(), questions.length));
    }
  }, [questions]);

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
        qIdx: currentQuestionIdx(),
      });
    } else {
      journey(
        setURL,
        p.data.getMeeting.beneficiary,
        p.data.getMeeting.outcomeSetID
      );
    }
  };

  const hasInstructions = () => {
    return (
      questionnaire.instructions && questionnaire.instructions.length !== 0
    );
  };

  const currentQuestionIdx = (): number => {
    return questions.findIndex((q) => q.id === currentQuestion);
  };

  const goToNextScreen = () => {
    const nextState = getNextState(
      screen,
      currentQuestionIdx(),
      questions.length
    );
    setMeetingState(nextState);
  };

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
      setCurrentQuestion(question.id);
    }
  };

  const goToPreviousScreen = () => {
    const prevState = getPreviousState(
      screen,
      currentQuestionIdx(),
      hasInstructions()
    );
    setMeetingState(prevState);
  };

  const canGoToPrevious = (): boolean => {
    return canGoBack(screen, currentQuestionIdx(), hasInstructions());
  };

  const renderFinished = (): JSX.Element => {
    return (
      <QuestionnaireReview
        record={p.data.getMeeting}
        onQuestionClick={goToQuestionWithID}
        onBack={goToPreviousScreen}
        onComplete={completed}
      />
    );
  };

  const renderNotepad = (): JSX.Element => {
    return (
      <MeetingNotepad
        record={p.data.getMeeting}
        onComplete={goToNextScreen}
        onBack={goToPreviousScreen}
      />
    );
  };

  const renderInstructions = (): JSX.Element => {
    return (
      <QuestionnaireInstructions
        title={questionnaire.name}
        text={questionnaire.instructions}
        onNext={goToNextScreen}
      />
    );
  };

  const renderProgressBar = (): JSX.Element => {
    let value = currentQuestionIdx();
    if (screen === Screen.NOTES || screen === Screen.REVIEW) {
      value = questions.length;
    }
    return <Progress value={value} total={questions.length} size="tiny" />;
  };

  const { data } = p;
  const wrapper = (
    inner: JSX.Element,
    progress: JSX.Element = <div />
  ): JSX.Element => {
    return (
      <div id="meeting">
        {progress}
        <Grid container={true} columns={1}>
          <Grid.Column>
            <Helmet>
              <title>{t("Questionnaire")}</title>
            </Helmet>
            <div>{inner}</div>
          </Grid.Column>
        </Grid>
      </div>
    );
  };

  if (data.error) {
    return wrapper(<Error text={t("Failed to load")} />);
  }
  if (data.loading || data.getMeeting === undefined) {
    return wrapper(<Loader active={true} inline="centered" />);
  }
  if (screen === Screen.REVIEW) {
    return wrapper(renderFinished(), renderProgressBar());
  }
  if (screen === Screen.NOTES) {
    return wrapper(renderNotepad(), renderProgressBar());
  }
  if (screen === Screen.INSTRUCTIONS) {
    return wrapper(renderInstructions(), renderProgressBar());
  }
  if (screen === Screen.THANKS) {
    return wrapper(<Thanks />);
  }
  if (screen === Screen.EMPTY) {
    return wrapper(
      <EmptyQuestionnaire
        questionnaireID={questionnaire.id}
        isBeneficiary={beneficiaryUser}
      />
    );
  }
  const currentQuestionID = currentQuestion;
  if (currentQuestionID === undefined) {
    return wrapper(<Loader active={true} inline="centered" />);
  }
  const meeting = data.getMeeting;
  return wrapper(
    <Question
      key={currentQuestionID}
      record={meeting}
      questionID={currentQuestionID}
      showPrevious={canGoToPrevious()}
      onPrevious={goToPreviousScreen}
      onNext={goToNextScreen}
    />,
    renderProgressBar()
  );
};

const Meeting = getMeeting<IProps>((props) => props.match.params.id)(
  MeetingInner
);
export { Meeting };
