import * as React from 'react';
import {IOutcomeResult, IOutcomeMutation, allOutcomeSets, newQuestionSet, deleteQuestionSet} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import {IURLConnector} from 'redux/modules/url';
import {renderArray} from 'helpers/react';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import { Button, Input, List, Icon } from 'semantic-ui-react';
import './style.less';
const { connect } = require('react-redux');

interface IProps extends IOutcomeMutation, IURLConnector {
  data: IOutcomeResult;
};

interface IState {
  createError?: string;
  deleteError?: string;
  newName?: string;
  newDescription?: string;
  newClicked?: boolean;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class SettingQuestionsInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      newClicked: false,
    };
    this.createQS = this.createQS.bind(this);
    this.deleteQS = this.deleteQS.bind(this);
    this.navigateToOutcomeSet = this.navigateToOutcomeSet.bind(this);
    this.renderOutcomeSet = this.renderOutcomeSet.bind(this);
    this.renderNewControl = this.renderNewControl.bind(this);
    this.setNewName = this.setNewName.bind(this);;
    this.setNewDescription = this.setNewDescription.bind(this);
    this.setNewClicked = this.setNewClicked.bind(this);
  }

  private navigateToOutcomeSet(id: string) {
    return () => this.props.setURL(`/outcomeset/${id}`);
  }

  private createQS() {
    this.props.newQuestionSet(this.state.newName, this.state.newDescription)
    .then(() => {
      this.setState({
        createError: undefined,
        newClicked: false,
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
      <List.Item className="question-set">
        <List.Content floated="right">
          <Button icon onClick={this.deleteQS(os.id)}>
            <Icon name="delete" />
          </Button>
        </List.Content>
        <List.Content onClick={this.navigateToOutcomeSet(os.id)}>
          <List.Header as="a">{os.name}</List.Header>
          <List.Description as="a">{os.description}</List.Description>
        </List.Content>
      </List.Item>
    );
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

  private setNewClicked() {
    this.setState({
      newClicked: true,
    });
  }

  private renderNewControl(): JSX.Element {
    if (this.state.newClicked) {
      return (
        <List.Item className="new-control">
          <List.Content>
            <Input type="text" placeholder="Name" onChange={this.setNewName}/>
            <Input type="text" placeholder="Description" onChange={this.setNewDescription}/>
            <Button onClick={this.createQS}>Create</Button>
            <p>{this.state.createError}</p>
          </List.Content>
        </List.Item>
      );
    } else {
      return (
        <List.Item className="new-control">
          <List.Content onClick={this.setNewClicked}>
            <List.Header as="a">New Question Set</List.Header>
          </List.Content>
        </List.Item>
      );
    }
  }

  public render() {
    const { data } = this.props;
    return (
      <div id="question-sets">
        <h1>Question Sets</h1>
        <List divided relaxed verticalAlign="middle" className="list">
          {renderArray(this.renderOutcomeSet, data.allOutcomeSets)}
          {this.renderNewControl()}
        </List>
      </div>
    );
  }
}
const OutcomeSets = allOutcomeSets(deleteQuestionSet(newQuestionSet(SettingQuestionsInner)));
export {OutcomeSets }
