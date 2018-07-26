import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IOutcomeResult, IOutcomeMutation, allOutcomeSets, newQuestionSet, deleteQuestionSet} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import {IURLConnector, setURL} from 'redux/modules/url';
import {renderArray} from 'helpers/react';
import { bindActionCreators } from 'redux';
import { Button, Input, List, Icon, Grid, Loader, ButtonProps } from 'semantic-ui-react';
import {ConfirmButton} from 'components/ConfirmButton';
import './style.less';
const { connect } = require('react-redux');
const ReactGA = require('react-ga');

interface IProps extends IOutcomeMutation, IURLConnector {
  data: IOutcomeResult;
}

interface IState {
  createError?: string;
  deleteError?: string;
  newName?: string;
  newDescription?: string;
  newClicked?: boolean;
  savingNewQuestion?: boolean;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class SettingQuestionsInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      newClicked: false,
      savingNewQuestion: false,
    };
    this.createQS = this.createQS.bind(this);
    this.deleteQS = this.deleteQS.bind(this);
    this.navigateToOutcomeSet = this.navigateToOutcomeSet.bind(this);
    this.renderOutcomeSet = this.renderOutcomeSet.bind(this);
    this.renderNewControl = this.renderNewControl.bind(this);
    this.setNewName = this.setNewName.bind(this);
    this.setNewDescription = this.setNewDescription.bind(this);
    this.setNewClicked = this.setNewClicked.bind(this);
  }

  private navigateToOutcomeSet(id: string) {
    return () => this.props.setURL(`/settings/questions/${id}`);
  }

  private logQuestionSetGAEvent(action: string) {
    ReactGA.event({
        category: 'questionset',
        action,
    });
  }

  private createQS() {
    this.setState({
      savingNewQuestion: true,
    });
    this.props.newQuestionSet(this.state.newName, this.state.newDescription)
    .then(() => {
      this.logQuestionSetGAEvent('created');
      this.setState({
        createError: undefined,
        newClicked: false,
        savingNewQuestion: false,
      });
    })
    .catch((e: Error)=> {
      this.setState({
        createError: e.message,
        savingNewQuestion: false,
      });
    });
  }

  private deleteQS(id: string) {
    return () =>
    this.props.deleteQuestionSet(id)
    .then(() => {
      this.logQuestionSetGAEvent('deleted');
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

  private setNewClicked(toSet: boolean): ()=>void {
    return ()=> {
      this.setState({
        newClicked: toSet,
      });
    };
  }

  private renderNewControl(): JSX.Element {
    if (this.state.newClicked) {
      const addProps: ButtonProps = {};
      if (this.state.savingNewQuestion) {
        addProps.loading = true;
        addProps.disabled = true;
       }
      return (
        <List.Item className="new-control" key="new">
          <List.Content>
            <Input type="text" placeholder="Name" onChange={this.setNewName}/>
            <Input type="text" placeholder="Description" onChange={this.setNewDescription}/>
            <Button onClick={this.setNewClicked(false)}>Cancel</Button>
            <Button {...addProps} primary={true} onClick={this.createQS}>Create</Button>
            <p>{this.state.createError}</p>
          </List.Content>
        </List.Item>
      );
    } else {
      return (
        <List.Item className="new-control" key="new">
          <List.Content onClick={this.setNewClicked(true)}>
            <List.Header as="a">New Questionnaire</List.Header>
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
        <List divided={true} relaxed={true} verticalAlign="middle" className="list">
          {renderArray(this.renderOutcomeSet, data.allOutcomeSets)}
          {this.renderNewControl()}
        </List>
      );
    }
    return (
      <Grid container={true} columns={1} id="question-sets">
        <Grid.Column>
          <Helmet>
            <title>Questionnaires</title>
          </Helmet>
          <h1>Questionnaires</h1>
          {inner}
        </Grid.Column>
      </Grid>
    );
  }
}
const OutcomeSets = allOutcomeSets<IProps>(deleteQuestionSet(newQuestionSet(SettingQuestionsInner)));
export {OutcomeSets };
