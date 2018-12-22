import {bindActionCreators} from 'redux';
import * as React from 'react';
import {Item, MultiChoice} from 'components/MultiChoice';
import {IURLConnector, setURL} from 'redux/modules/url';
import {PageWrapperHoC} from 'components/PageWrapperHoC';
const { connect } = require('react-redux');

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class NewQuestionnaireTypSelectionInner extends React.Component<IURLConnector, any> {

  constructor(props) {
    super(props);
    this.goToCatalogue = this.goToCatalogue.bind(this);
    this.goToCustom = this.goToCustom.bind(this);
  }

  private goToCatalogue() {
    this.props.setURL(`/catalogue`);
  }

  private goToCustom() {
    this.props.setURL(`/questions/new/custom`);
  }

  public render() {
    const items: Item[] = [{
      title: 'Custom',
      subtitle: 'Create your own questionnaire',
      onClick: this.goToCustom,
    }, {
      title: 'Catalogue',
      subtitle: 'Select a questionnaire from the literature',
      onClick: this.goToCatalogue,
    }];
    return <MultiChoice items={items} />;
  }
}

export const NewQuestionnaireTypeSelector = PageWrapperHoC('New Questionnaire', 'new-questionnaire', NewQuestionnaireTypSelectionInner);
