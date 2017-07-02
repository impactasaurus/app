import * as React from 'react';
import {IOutcomeResult, IOutcomeMutation, allOutcomeSets, newQuestionSet, deleteQuestionSet} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import {IURLConnector} from 'redux/modules/url';
import {renderArray} from 'helpers/react';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import { Button, Input } from 'semantic-ui-react';
const { connect } = require('react-redux');
const style = require('./style.css');

interface IProps extends IOutcomeMutation, IURLConnector {
  data: IOutcomeResult;
};

interface IState {
  createError: string;
  deleteError: string;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class SettingQuestionsInner extends React.Component<IProps, IState> {

  private newName: React.HTMLAttributes<string>;
  private newDescription: React.HTMLAttributes<string>;

  constructor(props) {
    super(props);
    this.state = {
      createError: undefined,
      deleteError: undefined,
    };
    this.createQS = this.createQS.bind(this);
    this.deleteQS = this.deleteQS.bind(this);
    this.navigateToOutcomeSet = this.navigateToOutcomeSet.bind(this);
    this.renderOutcomeSet = this.renderOutcomeSet.bind(this);
    this.renderNewControl = this.renderNewControl.bind(this);
    this.setNewName = this.setNewName.bind(this);;
    this.setNewDescription = this.setNewDescription.bind(this);
  }

  private navigateToOutcomeSet(id: string) {
    return () => this.props.setURL(`/outcomeset/${id}`);
  }

  private createQS() {
    this.props.newQuestionSet(this.newName.value as string, this.newDescription.value as string)
    .then(() => {
      this.setState({
        createError: undefined,
      });
    })
    .catch((e: Error)=> {
      this.setState({
        createError: e.message,
      });
    });
  }

  private deleteQS(id: string) {
    return () =>
    this.props.deleteQuestionSet(id)
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
  }

  private renderOutcomeSet(os: IOutcomeSet): JSX.Element {
    return (
      <div className={style.OutcomeSet} key={os.id}>
        <p>name: {os.name}</p>
        <p>description: {os.description}</p>
        <p>number of questions: {os.questions.length}</p>
        <Button onClick={this.deleteQS(os.id)}>Delete</Button>
        <Button onClick={this.navigateToOutcomeSet(os.id)}>Edit</Button>
        <p>{this.state.deleteError}</p>
      </div>
    );
  }

  private setNewName(input) {
    this.newName = input;
  }

  private setNewDescription(input) {
    this.newDescription = input;
  }

  private renderNewControl(): JSX.Element {
    return (
      <div>
        <Input type="text" placeholder="Name" ref={this.setNewName}/>
        <Input type="text" placeholder="Description" ref={this.setNewDescription}/>
        <Button onClick={this.createQS}>Create</Button>
        <p>{this.state.createError}</p>
      </div>
    );
  }

  public render() {
    const { data } = this.props;
    return (
      <div className={style.Home}>
        <p>
          Define question sets here<br />
          An organisation can have multiple questions sets, these will initially been shown in a list here along with a new button<br />
          One hitting new, the user is asked to define a set of likert scale style questions<br />
          Once the first question set has been defined, the organisation can start gathering feedback from beneficiaries<br />
        </p>
        <hr />
        <h2>Question Sets</h2>
        <div>
          {renderArray(this.renderOutcomeSet, data.allOutcomeSets)}
        </div>
        <hr />
        <h2>New Question Set</h2>
        {this.renderNewControl()}
      </div>
    );
  }
}
const OutcomeSets = allOutcomeSets(deleteQuestionSet(newQuestionSet(SettingQuestionsInner)));
export {OutcomeSets }
