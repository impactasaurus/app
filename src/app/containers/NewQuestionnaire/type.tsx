import {bindActionCreators} from 'redux';
import * as React from 'react';
import {Item, MultiChoice} from 'components/MultiChoice';
import {IURLConnector, setURL} from 'redux/modules/url';
import {PageWrapperHoC} from 'components/PageWrapperHoC';
import { Segment, Loader, Button } from 'semantic-ui-react';
import {ICatalogueImport, importQuestionnaire} from '../../apollo/modules/catalogue';
import {allOutcomeSets, IOutcomeResult} from '../../apollo/modules/outcomeSets';
const RocketIcon = require('./../../theme/rocket.inline.svg');
const { connect } = require('react-redux');
const strings = require('./../../../strings.json');

interface IProps extends ICatalogueImport, IURLConnector {
  data?: IOutcomeResult;
}
interface IState {
  error: boolean;
  importing: boolean;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class NewQuestionnaireTypSelectionInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.goToCatalogue = this.goToCatalogue.bind(this);
    this.goToCustom = this.goToCustom.bind(this);
    this.quickStart = this.quickStart.bind(this);
    this.state = {
      importing: false,
      error: false,
    };
  }

  private goToCatalogue() {
    this.props.setURL(`/catalogue`);
  }

  private goToCustom() {
    this.props.setURL(`/questions/new/custom`);
  }

  private quickStart() {
    this.setState({
      importing: true,
      error: false,
    });
    this.props.importQuestionnaire('eac0c7b4-c9af-4475-94b8-72c548ea9588')
    .then(() => {
      this.props.setURL('/questions');
    })
    .catch(() => {
      this.setState({
        importing: false,
        error: true,
      });
    });
  }

  private renderQuickStart(data: IOutcomeResult) {
    if(data.loading !== false || (data.allOutcomeSets && data.allOutcomeSets.length > 0)) {
      return <div key="noQuickStart" />;
    }
    let body: JSX.Element|JSX.Element[] = <Button primary={true} onClick={this.quickStart}>Add the ONS Wellbeing questionnaire</Button>;
    if(this.state.importing) {
      body = <Loader active={true} inline={true} size="mini" />;
    }
    if(this.state.error) {
      body = [
        <p key="whoops">Whoops, something went wrong.</p>,
        <p key="advice">{strings.failureGeneric}</p>,
      ];
    }
    return (
      <Segment key="quickStart" id="quick-start" raised={true} compact={true} style={{marginLeft:'auto',marginRight:'auto'}}>
        <h3 style={{fontWeight:'normal'}}>
          <RocketIcon style={{width:'1rem', marginRight:'.3rem'}}/>
          Quick start
        </h3>
        {body}
      </Segment>
    );
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
    return [
        this.renderQuickStart(this.props.data),
        <MultiChoice key="choice" items={items} />,
    ];
  }
}

export const NewQuestionnaireTypeSelector = PageWrapperHoC('New Questionnaire', 'new-questionnaire', allOutcomeSets(importQuestionnaire<IProps>(NewQuestionnaireTypSelectionInner)));
