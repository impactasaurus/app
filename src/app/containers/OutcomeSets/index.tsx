import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IOutcomeResult, IOutcomeMutation, allOutcomeSets, deleteQuestionSet} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import {IURLConnector, setURL} from 'redux/modules/url';
import {renderArray} from 'helpers/react';
import { bindActionCreators } from 'redux';
import { List, Icon, Grid, Loader } from 'semantic-ui-react';
import {ConfirmButton} from 'components/ConfirmButton';
import {Error} from 'components/Error';
import './style.less';
const { connect } = require('react-redux');
const ReactGA = require('react-ga');

interface IProps extends IOutcomeMutation, IURLConnector {
  data: IOutcomeResult;
}

interface IState {
  deleteError?: string;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class SettingQuestionsInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.deleteQS = this.deleteQS.bind(this);
    this.navigateToOutcomeSet = this.navigateToOutcomeSet.bind(this);
    this.renderOutcomeSet = this.renderOutcomeSet.bind(this);
    this.newClicked = this.newClicked.bind(this);
  }

  private navigateToOutcomeSet(id: string) {
    return () => this.props.setURL(`/questions/${id}`);
  }

  private logQuestionSetGAEvent(action: string) {
    ReactGA.event({
        category: 'questionset',
        action,
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

  private newClicked() {
    this.props.setURL('/questions/new');
  }

  private renderNewControl(): JSX.Element {
    return (
      <List.Item className="new-control" key="new">
        <List.Content onClick={this.newClicked}>
          <List.Header as="a">New Questionnaire</List.Header>
        </List.Content>
      </List.Item>
    );
  }

  public render() {
    let inner: JSX.Element;
    if (this.props.data.error) {
      inner = (<Error text="Failed to load questionnaires" />);
    } else if (this.props.data.loading) {
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
const OutcomeSets = allOutcomeSets<IProps>(deleteQuestionSet(SettingQuestionsInner));
export {OutcomeSets };
