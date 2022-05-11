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
import { IOutcomeSet } from "models/outcomeSet";
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

const MeetingInner = (p: IProps) => {
  const [state, setStateInner] = useState<IMeetingState>({
    qIdx: 0,
    screen: Screen.QUESTION,
  });
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
      setState(iState);
    }
  }, [questions]);

  const setState = (s: IMeetingState) => {
    let idxx = s.qIdx;
    if (idxx < 0) {
      idxx = 0;
    }
    if (idxx >= questions.length) {
      idxx = questions.length - 1;
    }
    setStateInner({
      qIdx: idxx,
      screen: s.screen,
    });
  };
  const setScreen = (screen: Screen) => setState({ qIdx: state.qIdx, screen });

  const goToQuestionWithID = (qID: string) => {
    const idx = questions.findIndex((q) => q.id === qID);
    setState({
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
      setScreen(Screen.THANKS);
    } else {
      journey(
        setURL,
        p.data.getMeeting.beneficiary,
        p.data.getMeeting.outcomeSetID
      );
    }
  };

  const goToNextScreen = () => {
    const newState = getNextState(state, questions.length);
    setState(newState);
  };

  const goToPreviousScreen = () => {
    const newState = getPreviousState(state, hasInstructions(questionnaire));
    setState(newState);
  };

  const canGoToPrevious = (): boolean => {
    return canGoBack(state, hasInstructions(questionnaire));
  };

  const ProgressBar = (): JSX.Element => {
    let value = state.qIdx;
    if (state.screen === Screen.NOTES || state.screen === Screen.REVIEW) {
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
  if (data.loading || !data.getMeeting || !questionnaire) {
    return (
      <Wrapper>
        <Loader active={true} inline="centered" />
      </Wrapper>
    );
  }
  if (state.screen === Screen.REVIEW) {
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
  if (state.screen === Screen.NOTES) {
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
  if (state.screen === Screen.INSTRUCTIONS) {
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
  if (state.screen === Screen.THANKS) {
    return (
      <Wrapper>
        <Thanks />
      </Wrapper>
    );
  }
  if (state.screen === Screen.EMPTY) {
    return (
      <Wrapper>
        <EmptyQuestionnaire
          questionnaireID={questionnaire.id}
          isBeneficiary={beneficiaryUser}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper progress={<ProgressBar />}>
      <Question
        key={state.qIdx}
        record={data.getMeeting}
        questionID={questions[state.qIdx].id}
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
