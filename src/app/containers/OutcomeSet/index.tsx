import * as React from 'react';
import {IOutcomeResult, getOutcomeSet, IOutcomeMutation, editQuestionSet} from 'apollo/modules/outcomeSets';
import {IQuestionMutation, deleteQuestion} from 'apollo/modules/questions';
import {renderArray} from 'helpers/react';
import {Question} from 'models/question';
import { Button, Input, List, Icon, Grid} from 'semantic-ui-react';
import {NewLikertQuestion} from 'components/NewLikertQuestion';
import {ConfirmButton} from 'components/ConfirmButton';
import './style.less';

interface IProps extends IOutcomeMutation, IQuestionMutation {
  data: IOutcomeResult;
  params: {
      id: string,
  };
};

interface IState {
  editError?: string;
  deleteError?: string;
  newName?: string;
  newDescription?: string;
  newClicked?: boolean;
  editClicked?: boolean;
};

class OutcomeSetInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      editError: undefined,
      deleteError: undefined,
    };
    this.renderEditControl = this.renderEditControl.bind(this);
    this.editQS = this.editQS.bind(this);
    this.renderNewQuestionControl = this.renderNewQuestionControl.bind(this);
    this.renderQuestion = this.renderQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.setNewName = this.setNewName.bind(this);
    this.setNewDescription = this.setNewDescription.bind(this);
    this.setNewClicked = this.setNewClicked.bind(this);
    this.setEditClicked = this.setEditClicked.bind(this);
    this.renderEditButton = this.renderEditButton.bind(this);
  }

  private editQS() {
    this.props.editQuestionSet(
      this.props.params.id,
      this.state.newName || this.props.data.getOutcomeSet.name,
      this.state.newDescription || this.props.data.getOutcomeSet.description,
    )
    .then(() => {
      this.setState({
        editError: undefined,
        editClicked: false,
      });
    })
    .catch((e: Error)=> {
      this.setState({
        editError: e.message,
      });
    });
  }

  private deleteQuestion(questionID: string) {
    return () => {
      this.props.deleteQuestion(this.props.params.id, questionID)
      .then(() => {
        this.setState({
          deleteError: undefined,
        });
      })
      .catch((e: Error)=> {
        this.setState({
          deleteError: e.message,
        });
      });
    };
  }

  private setNewName(_, data) {
    this.setState({
      newName: data.value,
    });
  }

  private setNewDescription(_, data) {
    this.setState({
      newDescription: data.value,
    });
  }

  private setNewClicked(newValue: boolean): ()=>void {
    return () => {
      this.setState({
        newClicked: newValue,
      });
    };
  }

  private setEditClicked() {
    this.setState({
      editClicked: true,
    });
  }

  private renderEditControl(): JSX.Element {
    if (this.state.editClicked !== true) {
      return (<div />);
    }
    return (
      <div className="edit-control">
        <Input type="text" placeholder="Name" onChange={this.setNewName} defaultValue={this.props.data.getOutcomeSet.name}/>
        <Input type="text" placeholder="Description" onChange={this.setNewDescription} defaultValue={this.props.data.getOutcomeSet.description}/>
        <Button onClick={this.editQS}>Edit</Button>
        <p>{this.state.editError}</p>
      </div>
    );
  }

  private renderQuestion(q: Question): JSX.Element {
    let descripton = '';
    if (q.minLabel || q.maxLabel) {
      descripton = `${q.minLabel} > ${q.maxLabel}`;
    }
    return (
      <List.Item className="question" key={q.id}>
        <List.Content floated="right">
          <ConfirmButton onConfirm={this.deleteQuestion(q.id)} promptText="Are you sure you want to archive this question?" buttonProps={{icon: true, size: 'mini'}} tooltip="Archive">
            <Icon name="archive"/>
          </ConfirmButton>
          <p>{this.state.deleteError}</p>
        </List.Content>
        <List.Header>{q.question}</List.Header>
        <List.Description>{descripton}</List.Description>
      </List.Item>
    );
  }

  private renderNewQuestionControl(): JSX.Element {
    if (this.state.newClicked === true) {
      return (
        <List.Item className="new-control">
          <List.Content>
            <NewLikertQuestion QuestionSetID={this.props.params.id} OnSuccess={this.setNewClicked(false)} />
          </List.Content>
        </List.Item>
      );
    } else {
      return (
        <List.Item className="new-control">
          <List.Content onClick={this.setNewClicked(true)}>
            <List.Header as="a">New Question</List.Header>
          </List.Content>
        </List.Item>
      );
    }
  }

  private renderEditButton(): JSX.Element {
    if (this.state.editClicked === true) {
      return (<div />);
    }
    return (
      <Button icon basic circular size="mini" onClick={this.setEditClicked}>
        <Icon name="pencil"/>
      </Button>
    );
  }

  public render() {
    const { data } = this.props;
    const os = data.getOutcomeSet;
    if (os === undefined) {
        return (<div />);
    }
    return (
      <Grid container columns={1} id="question-set">
        <Grid.Column>
          <h1>{os.name}{this.renderEditButton()}</h1>
          <h3>{os.description}{this.renderEditButton()}</h3>
          {this.renderEditControl()}
          <List divided relaxed verticalAlign="middle" className="list">
            {renderArray(this.renderQuestion, os.questions.filter((q) => !q.archived))}
            {this.renderNewQuestionControl()}
          </List>
        </Grid.Column>
      </Grid>
    );
  }
}
const OutcomeSet = getOutcomeSet<IProps>((props) => props.params.id)(editQuestionSet(deleteQuestion(OutcomeSetInner)));
export { OutcomeSet }
