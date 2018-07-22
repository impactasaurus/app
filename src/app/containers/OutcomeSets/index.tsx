import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IOutcomeResult, IOutcomeMutation, allOutcomeSets, newQuestionSet, deleteQuestionSet} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import {IURLConnector} from 'redux/modules/url';
import {renderArray} from 'helpers/react';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import { List, Icon, Grid, Loader } from 'semantic-ui-react';
import {INewQuestionnaire, NewQuestionnaireForm} from 'components/NewQuestionnaireForm';
import {ConfirmButton} from 'components/ConfirmButton';
import './style.less';
const { connect } = require('react-redux');
const ReactGA = require('react-ga');

interface IProps extends IOutcomeMutation, IURLConnector {
  data: IOutcomeResult;
};

interface IState {
  deleteError?: string;
  newClicked?: boolean;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class SettingQuestionsInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.createQS = this.createQS.bind(this);
    this.deleteQS = this.deleteQS.bind(this);
    this.navigateToOutcomeSet = this.navigateToOutcomeSet.bind(this);
    this.renderOutcomeSet = this.renderOutcomeSet.bind(this);
    this.renderNewControl = this.renderNewControl.bind(this);
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

  private createQS(q: INewQuestionnaire) {
    return this.props.newQuestionSet(q.name, q.description)
      .then(this.setNewClicked(false));
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
          <ConfirmButton buttonProps={{icon: true}}
                         promptText={`Are you sure you want to delete the '${os.name}' question set?`}
                         onConfirm={this.deleteQS(os.id)}>
            <Icon name="delete"/>
          </ConfirmButton>
        </List.Content>
        <List.Content onClick={this.navigateToOutcomeSet(os.id)}>
          <List.Header as="a">{os.name}</List.Header>
          <List.Description as="a">{os.description}</List.Description>
        </List.Content>
      </List.Item>
    );
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
      return (
        <List.Item className="new-control" key="new">
          <List.Content>
            <NewQuestionnaireForm
              onCancel={this.setNewClicked(false)}
              submit={this.createQS}
            />
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
        <List divided relaxed verticalAlign="middle" className="list">
          {renderArray(this.renderOutcomeSet, data.allOutcomeSets)}
          {this.renderNewControl()}
        </List>
      );
    }
    return (
      <Grid container columns={1} id="question-sets">
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
export {OutcomeSets }
