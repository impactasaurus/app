import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IOutcomeResult, getOutcomeSet, IOutcomeMutation, editQuestionSet} from 'apollo/modules/outcomeSets';
import {IQuestionMutation, deleteQuestion} from 'apollo/modules/questions';
import { Button, Input, Icon, Grid, Loader } from 'semantic-ui-react';
import {CategoryList} from 'components/CategoryList';
import {QuestionList} from 'components/QuestionList';
import {Hint} from 'components/Hint';
const strings = require('./../../../strings.json');
import './style.less';

interface IProps extends IOutcomeMutation, IQuestionMutation {
  data: IOutcomeResult;
  params: {
      id: string,
  };
};

interface IState {
  editError?: string;
  newName?: string;
  newDescription?: string;
  editClicked?: boolean;
};

class OutcomeSetInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.renderEditControl = this.renderEditControl.bind(this);
    this.editQS = this.editQS.bind(this);
    this.setNewName = this.setNewName.bind(this);
    this.setNewDescription = this.setNewDescription.bind(this);
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
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    const { data } = this.props;
    const os = data.getOutcomeSet;
    if (os === undefined) {
        return (<div />);
    }
    return (
      <Grid container columns={1} id="question-set">
        <Grid.Column>
          <Helmet>
            <title>Question Sets</title>
          </Helmet>
          <h1>{os.name}{this.renderEditButton()}</h1>
          <div>Description: {os.description || 'No description'}{this.renderEditButton()}</div>
          {this.renderEditControl()}
          <h3>Questions</h3>
          <QuestionList outcomeSetID={this.props.params.id} />
          <h3>Question Categories <Hint text={strings.questionCategoryExplanation} /></h3>
          <CategoryList outcomeSetID={this.props.params.id} />
        </Grid.Column>
      </Grid>
    );
  }
}
const OutcomeSet = getOutcomeSet<IProps>((props) => props.params.id)(editQuestionSet<IProps>(deleteQuestion(OutcomeSetInner)));
export { OutcomeSet }
