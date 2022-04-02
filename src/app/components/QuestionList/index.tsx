import React, { useMemo, useState } from "react";
import {
  IQuestionMutation,
  deleteQuestion,
  IQuestionMover,
  moveQuestion,
} from "apollo/modules/questions";
import { ILikertForm, Question } from "models/question";
import { IOutcomeSet } from "models/outcomeSet";
import { Message, List, Button } from "semantic-ui-react";
import { NewLikertQuestion } from "components/NewLikertQuestion";
import { EditLikertQuestion } from "components/EditLikertQuestion";
import { List as QList } from "./List";
import { getQuestions } from "helpers/questionnaire";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import "./style.less";

interface IProps extends IQuestionMutation, IQuestionMover {
  questionnaire: IOutcomeSet;
  outcomeSetID: string;
  readOnly?: boolean; // defaults to false
}

function assignCategoriesClasses(
  current: { [catID: string]: string },
  questionnaire: IOutcomeSet
): { [catID: string]: string } {
  const assignments = { ...current };
  if (!questionnaire || !Array.isArray(questionnaire.questions)) {
    return assignments;
  }
  questionnaire.questions.forEach((q: Question) => {
    if (!q.categoryID) {
      return;
    }
    const assignment = assignments[q.categoryID];
    if (assignment) {
      return;
    }
    const noAssigned = Object.keys(assignments).length;
    assignments[q.categoryID] = `col-${noAssigned % 5}`;
  });
  return assignments;
}

const WrappedQuestionForm = (p: {
  title: string;
  children: JSX.Element;
}): JSX.Element => (
  <Message className="form-container likert-form-container" key="question-form">
    <Message.Header>{p.title}</Message.Header>
    <Message.Content>{p.children}</Message.Content>
  </Message>
);

const QuestionListInner = (p: IProps) => {
  const categoryClasses = useMemo(
    () => assignCategoriesClasses({}, p.questionnaire),
    [p.questionnaire]
  );
  const [sorting, setSorting] = useState<boolean>(false);
  const [creatingQuestion, setRawCreatingQuestion] = useState<boolean>(false);
  const [editingQuestionID, setRawEditingQuestionID] =
    useState<string | undefined>(undefined);
  const { t } = useTranslation();

  const deleteQuestion = (questionID: string): (() => Promise<IOutcomeSet>) => {
    return (): Promise<IOutcomeSet> => {
      ReactGA.event({
        category: "question",
        action: "deleted",
        label: "likert",
      });
      return p.deleteQuestion(p.outcomeSetID, questionID);
    };
  };

  const setCreatingQuestion = (newValue: boolean): (() => void) => {
    return () => {
      setRawCreatingQuestion(newValue);
      setRawEditingQuestionID(undefined);
    };
  };

  const setEditingQuestionID = (questionId: string): (() => void) => {
    return () => {
      setRawCreatingQuestion(false);
      setRawEditingQuestionID(questionId);
    };
  };

  const getCategoryPillClass = (catID?: string): string | undefined =>
    !catID ? undefined : categoryClasses[catID];

  const onSortStart = () => {
    setSorting(true);
  };

  const onSortEnd = ({ oldIndex, newIndex }): void => {
    setSorting(false);
    if (oldIndex === newIndex) {
      return;
    }
    const questions = getQuestions(p.questionnaire);
    if (oldIndex >= questions.length) {
      throw new Error("Old index does not exist in array");
    }
    const q = questions[oldIndex];
    p.moveQuestion(p.questionnaire, q.id, newIndex)
      .then(() => {
        ReactGA.event({
          category: "question",
          action: "moved",
          label: "likert",
        });
      })
      .catch((e) => {
        ReactGA.event({
          category: "question",
          action: "move-fail",
          label: "likert",
        });
        console.error(e);
      });
  };

  const renderNewQuestionControl = (): JSX.Element => {
    if (creatingQuestion) {
      let defaults: ILikertForm;
      const qs = getQuestions(p.questionnaire) || [];
      if (qs.length > 0) {
        const last = qs[qs.length - 1] as Question;
        defaults = {
          labels: last.labels,
          rightValue: last.rightValue,
          leftValue: last.leftValue,
        };
      }
      return (
        <List.Item className="new-control">
          <List.Content>
            <WrappedQuestionForm title={t("Add Question")}>
              <NewLikertQuestion
                QuestionSetID={p.outcomeSetID}
                OnSuccess={setCreatingQuestion(false)}
                OnCancel={setCreatingQuestion(false)}
                Defaults={defaults}
              />
            </WrappedQuestionForm>
          </List.Content>
        </List.Item>
      );
    } else {
      return (
        <List.Item className="new-button">
          <List.Content style={{ textAlign: "center", marginTop: "1em" }}>
            <Button
              icon="plus"
              content={t("Add Question")}
              primary={true}
              onClick={setCreatingQuestion(true)}
            />
          </List.Content>
        </List.Item>
      );
    }
  };

  const renderEditQuestionForm = (q: Question): JSX.Element => {
    return (
      <WrappedQuestionForm title={t("Edit Likert Question")}>
        <EditLikertQuestion
          key={"edit-" + q.id}
          question={q}
          QuestionSetID={p.outcomeSetID}
          OnSuccess={setEditingQuestionID(null)}
          OnCancel={setEditingQuestionID(null)}
        />
      </WrappedQuestionForm>
    );
  };

  if (!p.questionnaire) {
    return <div />;
  }

  return (
    <QList
      className={sorting ? "sorting" : ""}
      key={`qlist-${editingQuestionID}-${creatingQuestion}`}
      outcomeSetID={p.outcomeSetID}
      questionnaire={p.questionnaire}
      editedQuestionID={editingQuestionID}
      newQuestionControl={renderNewQuestionControl()}
      renderEditQuestionForm={renderEditQuestionForm}
      deleteQuestion={deleteQuestion}
      getCategoryPillClass={getCategoryPillClass}
      setEditedQuestionId={setEditingQuestionID}
      axis="y"
      lockAxis="y"
      useDragHandle={true}
      onSortEnd={onSortEnd}
      onSortStart={onSortStart}
      readOnly={p.readOnly}
    />
  );
};

export const QuestionList = moveQuestion<IProps>(
  deleteQuestion<IProps>(QuestionListInner)
);
