import * as React from 'react';
import {RecordChecklistItem} from './record-item';
import {QuestionnaireChecklistItem} from './questionnaire-item';
import {Segment, Divider, Icon} from 'semantic-ui-react';
import './style.less';

const localStorageKey = 'onboarded';
const localStorageValue = 'v1';

interface IProps {
  dismissible?: boolean; // defaults to true
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
    return (
      <Segment id="onboarding-checklist" raised={true}>
        {canBeDismissed(this.props) && <Icon name="close" onClick={this.onClose} />}
        <h1>Welcome!</h1>
        <p>To get started with Impactasaurus, try out the following two steps</p>
        <p>If you have any questions, drop us an email at <a href="mailto:support@impactasaurus.org">support@impactasaurus.org</a> - we would love to help</p>
        <Divider fitted={true} />
        <QuestionnaireChecklistItem />
        <RecordChecklistItem />
      </Segment>
    );
  }
}
