import * as React from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';
import {IURLConnector, setURL} from 'redux/modules/url';
import {INewQuestionnaire, NewQuestionnaireForm} from 'components/NewQuestionnaireForm';
import { bindActionCreators } from 'redux';
import {newQuestionSet} from 'apollo/modules/outcomeSets';
import {IOutcomeMutation} from '../../apollo/modules/outcomeSets';
import {PageWrapperHoC} from '../../components/PageWrapperHoC';
import './style.less';
import {IOutcomeSet} from '../../models/outcomeSet';
const { connect } = require('react-redux');

enum CustomState {
  GENERAL,
}

interface IProps extends IOutcomeMutation, IURLConnector {}

interface IState {
  customState?: CustomState;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class NewQuestionnaireInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.goToCatalogue = this.goToCatalogue.bind(this);
    this.goToQuestionnaire = this.goToQuestionnaire.bind(this);
    this.goToState = this.goToState.bind(this);
    this.createQS = this.createQS.bind(this);
  }

  private goToCatalogue() {
    this.props.setURL(`/catalogue`);
  }

  private goToQuestionnaire(q: IOutcomeSet) {
    this.props.setURL(`/questions/${q.id}`);
  }

  private goToState(s: CustomState|undefined): () => void {
    return () => {
      this.setState({
        customState: s,
      });
    };
  }

  private createQS(q: INewQuestionnaire) {
    return this.props.newQuestionSet(q.name, q.description)
      .then(this.goToQuestionnaire);
  }

  private renderNewControl(): JSX.Element {
    return (
      <NewQuestionnaireForm
        onCancel={this.goToState(undefined)}
        submit={this.createQS}
      />
    );
  }

  public render() {
    if (this.state.customState === CustomState.GENERAL) {
      return this.renderNewControl();
    }
    return (
      <Card.Group>
        <Card>
          <div className="type-pic first">
            <Icon name="edit" size="big" />
          </div>
          <Card.Content>
            <Card.Header>
              Custom
            </Card.Header>
            <Card.Meta>
              Create your own questionnaire
            </Card.Meta>
          </Card.Content>
          <Card.Content extra={true}>
            <Button primary={true} onClick={this.goToState(CustomState.GENERAL)}>Select</Button>
          </Card.Content>
        </Card>
        <Card>
          <div className="type-pic second">
            <Icon name="th list" size="big" />
          </div>
          <Card.Content>
            <Card.Header>
              Catalogue
            </Card.Header>
            <Card.Meta>
              Select a questionnaire from the literature
            </Card.Meta>
          </Card.Content>
          <Card.Content extra={true}>
            <Button primary={true} onClick={this.goToCatalogue}>Select</Button>
          </Card.Content>
        </Card>
      </Card.Group>
    );
  }
}

export const NewQuestionnaire = newQuestionSet(PageWrapperHoC('New Questionnaire', 'new-questionnaire', NewQuestionnaireInner));
