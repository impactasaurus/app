import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IOutcomeResult, IOutcomeMutation, allOutcomeSets, newQuestionSet, deleteQuestionSet} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import {IURLConnector} from 'redux/modules/url';
import {renderArray} from 'helpers/react';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import { Button, Input, List, Icon, Grid, Loader } from 'semantic-ui-react';
import {ConfirmButton} from 'components/ConfirmButton';
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
    return () => this.props.setURL(`/settings/questions/${id}`);
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
      <List.Item className="question-set" key={os.id}>
        <List.Content floated="right">
          <ConfirmButton buttonProps={{icon:true}} promptText={`Are you sure you want to delete the '${os.name}' question set?`} onConfirm={this.deleteQS(os.id)}>
            <Icon name="delete" />
          </ConfirmButton>
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
        <List.Item className="new-control" key="new">
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
        <List.Item className="new-control" key="new">
          <List.Content onClick={this.setNewClicked}>
            <List.Header as="a">New Question Set</List.Header>
          </List.Content>
        </List.Item>
      );
    }
  }

  public render() {
    let inner: JSX.Element;
    if (this.props.data.loading) {
      inner = (
        <Loader active={true} inline="centered" />
      );
    } else {
      const { data } = this.props;
      inner = (
        <List divided relaxed verticalAlign="middle" className="list">
          {renderArray(this.renderOutcomeSet, data.allOutcomeSets)}
          {this.renderNewControl()}
        </List>
      );
    }
    return (
      <div>
        <Helmet>
          <title>Question Sets</title>
        </Helmet>
        <Grid container columns={1} id="question-sets">
          <Grid.Column>
            <h1>Question Sets</h1>
            {inner}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
const OutcomeSets = allOutcomeSets(deleteQuestionSet(newQuestionSet(SettingQuestionsInner)));
export {OutcomeSets }
