import * as React from 'react';
import {RecordChecklistItem} from './record-item';
import {QuestionnaireChecklistItem} from './questionnaire-item';
import {Segment, Divider, Icon} from 'semantic-ui-react';
import './style.less';
import {ReportChecklistItem} from 'components/OnboardingChecklist/report-item';
const RocketIcon = require('./../../theme/rocket.inline.svg');

const localStorageKey = 'onboarded';
const localStorageValue = 'v1';

interface IProps {
  dismissible?: boolean; // defaults to true
  customHeader?: JSX.Element; // if not provided, defaults to normal Welcome text
  minimal?: boolean; /// defaults to false
}

interface IState {
  dismissed: boolean;
}

const isDismissed = () => localStorage.getItem(localStorageKey) !== null;
const setDismissed = () => localStorage.setItem(localStorageKey, localStorageValue);

const canBeDismissed = (p: IProps) => p.dismissible !== false;

export class OnboardingChecklist extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.state = {
      dismissed: canBeDismissed(props) && isDismissed(),
    };
  }

  public componentWillUpdate(nextProps: IProps) {
    if (canBeDismissed(nextProps) !== canBeDismissed(this.props)) {
      this.setState({
        dismissed: canBeDismissed(nextProps) && isDismissed(),
      });
    }
  }

  private onClose() {
    setDismissed();
    this.setState({
      dismissed: canBeDismissed(this.props) && true,
    });
  }

  public render() {
    if (this.state.dismissed) {
      return (<div />);
    }
    let header = (
      <>
      <h1>Welcome!</h1>
      <p>We have prepared <b>three simple steps to get you started</b> <RocketIcon style={{marginLeft:'.3rem'}}/></p>
      </>
    );
    if(this.props.customHeader !== undefined) {
      header = this.props.customHeader;
    }
    return (
      <Segment id="onboarding-checklist" raised={true}>
        {canBeDismissed(this.props) && <Icon name="close" onClick={this.onClose} />}
        {header}
        <Divider fitted={true} />
        <QuestionnaireChecklistItem index={1} minimal={this.props.minimal} />
        <RecordChecklistItem index={2} minimal={this.props.minimal} />
        <ReportChecklistItem index={3} minimal={this.props.minimal} />
      </Segment>
    );
  }
}
