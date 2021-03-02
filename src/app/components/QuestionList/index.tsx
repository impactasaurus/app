import * as React from 'react';
import {IQuestionMutation, deleteQuestion, IQuestionMover, moveQuestion} from 'apollo/modules/questions';
import {ILikertForm, Question} from 'models/question';
import {IOutcomeSet} from 'models/outcomeSet';
import { Loader, Message, List } from 'semantic-ui-react';
import {NewLikertQuestion} from 'components/NewLikertQuestion';
import {EditLikertQuestion} from 'components/EditLikertQuestion';
import {List as QList} from './List';
import {isNullOrUndefined} from 'util';
import {getQuestions} from 'helpers/questionnaire';
import ReactGA from 'react-ga';
import { WithTranslation, withTranslation } from 'react-i18next';
import './style.less';

interface IProps extends IQuestionMutation, IQuestionMover, WithTranslation {
  questionnaire: IOutcomeSet;
  outcomeSetID: string;
  readOnly?: boolean; // defaults to false
}

interface IState {
  newQuestionClicked?: boolean;
  editedQuestionId?: string;
  categoryClasses?: {[catID: string]: string};
  sorting?: boolean;
}

function assignCategoriesClasses(current: {[catID: string]: string}, questionnaire: IOutcomeSet): {[catID: string]: string} {
  const assignments = {...current};
  if (isNullOrUndefined(questionnaire) || !Array.isArray(questionnaire.questions)) {
    return assignments;
  }
  questionnaire.questions.forEach((q: Question) => {
    if (isNullOrUndefined(q.categoryID)) {
      return;
    }
    const assignment = assignments[q.categoryID];
    if (!isNullOrUndefined(assignment)) {
      return;
    }
    const noAssigned = Object.keys(assignments).length;
    assignments[q.categoryID] = `col-${noAssigned % 5}`;
  });
  return assignments;
}

const wrapQuestionForm = (title: string, inner: JSX.Element): JSX.Element => ((
  <Message className="form-container likert-form-container" key="question-form">
    <Message.Header>{title}</Message.Header>
    <Message.Content>
      {inner}
    </Message.Content>
  </Message>
));

class QuestionListInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      categoryClasses: assignCategoriesClasses({}, this.props.questionnaire),
      sorting: false,
    };
    this.renderNewQuestionControl = this.renderNewQuestionControl.bind(this);
    this.renderEditQuestionForm = this.renderEditQuestionForm.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.setNewQuestionClicked = this.setNewQuestionClicked.bind(this);
    this.getCategoryPillClass = this.getCategoryPillClass.bind(this);
    this.setEditedQuestionId = this.setEditedQuestionId.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.onSortStart = this.onSortStart.bind(this);
  }

  public componentWillUpdate(nextProps: IProps) {
    const currentAssignment = this.state.categoryClasses;
    const newAssignments = assignCategoriesClasses(currentAssignment, nextProps.questionnaire);
    if (Object.keys(newAssignments).length !== Object.keys(currentAssignment).length) {
      this.setState({
        ...this.state,
        categoryClasses: newAssignments,
      });
    }
  }

  private logQuestionDeletedGAEvent() {
    ReactGA.event({
        category: 'question',
        action: 'deleted',
        label: 'likert',
    });
  }

  private deleteQuestion(questionID: string) {
    return (): Promise<IOutcomeSet> => {
      this.logQuestionDeletedGAEvent();
      return this.props.deleteQuestion(this.props.outcomeSetID, questionID);
    };
  }

  private setNewQuestionClicked(newValue: boolean): ()=>void {
    return () => {
      this.setState({
        newQuestionClicked: newValue,
        editedQuestionId: undefined,
      });
    };
  }

  private setEditedQuestionId(questionId: string): ()=>void {
    return () => {
      this.setState({
        newQuestionClicked: false,
        editedQuestionId: questionId,
      });
    };
  }

  private renderEditQuestionForm(q: Question): JSX.Element {
    const {t} = this.props;
    return wrapQuestionForm(t('Edit Likert Question'), (
      <EditLikertQuestion
        key={'edit-' + q.id}
        question={q}
        QuestionSetID={this.props.outcomeSetID}
        OnSuccess={this.setEditedQuestionId(null)}
        OnCancel={this.setEditedQuestionId(null)}
      />
    ));
  }

  private getCategoryPillClass(catID?: string): string|undefined {
    return (isNullOrUndefined(catID)) ? undefined : this.state.categoryClasses[catID];
  }

  private renderNewQuestionControl(): JSX.Element {
    const {t} = this.props;
    if (this.state.newQuestionClicked === true) {
      let defaults: ILikertForm;
      const qs = getQuestions(this.props.questionnaire) || [];
      if (qs.length > 0) {
        const last = qs[qs.length-1] as Question;
        defaults = {
          labels: last.labels,
          rightValue: last.rightValue,
          leftValue: last.leftValue,
        };
      }
      return (
        <List.Item className="new-control">
          <List.Content>
            {wrapQuestionForm(t('New Likert Question'), (
              <NewLikertQuestion
                QuestionSetID={this.props.outcomeSetID}
                OnSuccess={this.setNewQuestionClicked(false)}
                OnCancel={this.setNewQuestionClicked(false)}
                Defaults={defaults}
              />
            ))}
          </List.Content>
        </List.Item>
      );
    } else {
      return (
        <List.Item className="new-control">
          <List.Content onClick={this.setNewQuestionClicked(true)}>
            <List.Header as="a">{t("New Question")}</List.Header>
          </List.Content>
        </List.Item>
      );
    }
  }

  private onSortStart() {
    this.setState({
      sorting: true,
    });
  }

  private onSortEnd({oldIndex, newIndex}) {
    this.setState({
      sorting: false,
    });
    if (oldIndex === newIndex) {
      return;
    }
    const questions = getQuestions(this.props.questionnaire);
    if (oldIndex >= questions.length) {
      throw new Error('Old index does not exist in array');
    }
    const q = questions[oldIndex];
    this.props.moveQuestion(this.props.questionnaire, q.id, newIndex)
      .then(() => {
        ReactGA.event({
          category: 'question',
          action: 'moved',
          label: 'likert',
        });
      })
      .catch((e) => {
        ReactGA.event({
          category: 'question',
          action: 'move-fail',
          label: 'likert',
        });
        console.error(e);
      });
  }

  public render() {
    if (!this.props.questionnaire) {
      return (
        <Loader active={true} inline="centered" />
      );
    }

    return (
      <QList
        className={this.state.sorting ? 'sorting' : ''}
        key={`qlist-${this.state.editedQuestionId}-${this.state.newQuestionClicked}`}
        outcomeSetID={this.props.outcomeSetID}
        questionnaire={this.props.questionnaire}
        editedQuestionID={this.state.editedQuestionId}
        newQuestionControl={this.renderNewQuestionControl()}
        renderEditQuestionForm={this.renderEditQuestionForm}
        deleteQuestion={this.deleteQuestion}
        getCategoryPillClass={this.getCategoryPillClass}
        setEditedQuestionId={this.setEditedQuestionId}
        axis="y"
        lockAxis="y"
        useDragHandle={true}
        onSortEnd={this.onSortEnd}
        onSortStart={this.onSortStart}
        readOnly={this.props.readOnly}
      />
    );
  }
}
const QuestionListConnected = moveQuestion<IProps>(deleteQuestion<IProps>(QuestionListInner));
const QuestionList = withTranslation()(QuestionListConnected);
export { QuestionList };
