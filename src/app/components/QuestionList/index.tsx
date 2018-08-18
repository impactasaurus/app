import * as React from 'react';
import {IOutcomeResult} from 'apollo/modules/outcomeSets';
import {IQuestionMutation, deleteQuestion, IQuestionMover, moveQuestion} from 'apollo/modules/questions';
import {ILikertForm, Question} from 'models/question';
import {IOutcomeSet} from 'models/outcomeSet';
import { Loader, Message, List } from 'semantic-ui-react';
import {NewLikertQuestion} from 'components/NewLikertQuestion';
import {EditLikertQuestion} from 'components/EditLikertQuestion';
import {List as QList} from './List';
import './style.less';
import {isNullOrUndefined} from 'util';
import {getQuestions} from '../../helpers/questionnaire';
const ReactGA = require('react-ga');

interface IProps extends IQuestionMutation, IQuestionMover {
  data: IOutcomeResult;
  outcomeSetID: string;
}

interface IState {
  newQuestionClicked?: boolean;
  editedQuestionId?: string;
  categoryClasses?: {[catID: string]: string};
}

function assignCategoriesClasses(current: {[catID: string]: string}, data: IOutcomeResult): {[catID: string]: string} {
  const assignments = {...current};
  if (isNullOrUndefined(data.getOutcomeSet) || !Array.isArray(data.getOutcomeSet.questions)) {
    return assignments;
  }
  data.getOutcomeSet.questions.forEach((q: Question) => {
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
      categoryClasses: assignCategoriesClasses({}, this.props.data),
    };
    this.renderNewQuestionControl = this.renderNewQuestionControl.bind(this);
    this.renderEditQuestionForm = this.renderEditQuestionForm.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.setNewQuestionClicked = this.setNewQuestionClicked.bind(this);
    this.getCategoryPillClass = this.getCategoryPillClass.bind(this);
    this.setEditedQuestionId = this.setEditedQuestionId.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  public componentWillUpdate(nextProps: IProps) {
    const currentAssignment = this.state.categoryClasses;
    const newAssignments = assignCategoriesClasses(currentAssignment, nextProps.data);
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
    return wrapQuestionForm('Edit Likert Question', (
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
    if (this.state.newQuestionClicked === true) {
      let defaults: ILikertForm;
      const qs = getQuestions(this.props.data.getOutcomeSet) || [];
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
            {wrapQuestionForm('New Likert Question', (
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
            <List.Header as="a">New Question</List.Header>
          </List.Content>
        </List.Item>
      );
    }
  }

  private onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex === newIndex) {
      return;
    }
    const questions = getQuestions(this.props.data.getOutcomeSet);
    if (oldIndex >= questions.length) {
      throw new Error('Old index does not exist in array');
    }
    const q = questions[oldIndex];
    this.props.moveQuestion(this.props.data.getOutcomeSet, q.id, newIndex)
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
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }

    return (
      <QList
        key={`qlist-${this.state.editedQuestionId}-${this.state.newQuestionClicked}`}
        outcomeSetID={this.props.outcomeSetID}
        data={this.props.data}
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
      />
    );
  }
}
const QuestionList = moveQuestion<IProps>(deleteQuestion<IProps>(QuestionListInner));
export { QuestionList };
