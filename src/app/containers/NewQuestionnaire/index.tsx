import * as React from 'react';
import {IURLConnector, setURL} from 'redux/modules/url';
import {INewQuestionnaire, NewQuestionnaireForm} from 'components/NewQuestionnaireForm';
import { bindActionCreators } from 'redux';
import {newQuestionSet} from 'apollo/modules/outcomeSets';
import {IOutcomeMutation} from '../../apollo/modules/outcomeSets';
import {PageWrapperHoC} from '../../components/PageWrapperHoC';
import {IOutcomeSet} from '../../models/outcomeSet';
import {Item, MultiChoice} from '../../components/MultiChoice';
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
    const items: Item[] = [{
      title: 'Custom',
      subtitle: 'Create your own questionnaire',
      onClick: this.goToState(CustomState.GENERAL),
    }, {
      title: 'Catalogue',
      subtitle: 'Select a questionnaire from the literature',
      onClick: this.goToCatalogue,
    }];
    return (
      <div style={{paddingTop: '2rem'}}>
        <MultiChoice items={items} />
      </div>
    );
  }
}

export const NewQuestionnaire = newQuestionSet(PageWrapperHoC('New Questionnaire', 'new-questionnaire', NewQuestionnaireInner));
