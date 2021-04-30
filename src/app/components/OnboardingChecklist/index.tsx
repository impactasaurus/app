import React, {useState, useEffect} from 'react';
import {RecordChecklistItem} from './record-item';
import {QuestionnaireChecklistItem} from './questionnaire-item';
import {Segment, Divider, Icon} from 'semantic-ui-react';
import './style.less';
import {ReportChecklistItem} from 'components/OnboardingChecklist/report-item';
import RocketIcon from './../../theme/rocket.inline.svg';
import { useTranslation, Trans } from 'react-i18next';

const localStorageKey = 'onboarded';
const localStorageValue = 'v1';

interface IProps {
  dismissible?: boolean; // defaults to true
  forceDismiss?: boolean; // defaults to false
  customHeader?: JSX.Element; // if not provided, defaults to normal Welcome text
  minimal?: boolean; /// defaults to false
}

const isDismissed = () => localStorage.getItem(localStorageKey) !== null;
const setDismissed = () => localStorage.setItem(localStorageKey, localStorageValue);

const canBeDismissed = (p: IProps) => p.dismissible !== false;

export const OnboardingChecklist = (p: IProps): JSX.Element => {

  const [dismissed, setDismissedState] = useState<boolean>(canBeDismissed(p) && isDismissed());
  const {t} = useTranslation();

  useEffect(() => {
    if(p.forceDismiss === true && isDismissed() === false) {
      setDismissed();
    }
    const nextDismissed = canBeDismissed(p) && isDismissed();
    if (dismissed !== nextDismissed) {
      setDismissedState(nextDismissed);
    }
  }, [p.dismissible, p.forceDismiss, dismissed]);

  const onClose = () => {
    setDismissed();
    setDismissedState(canBeDismissed(p));
  }

  if (dismissed) {
    return (<div />);
  }
  let header = (
    <>
    <h1>{t("Welcome!")}</h1>
    <p>
      <Trans
        defaults="We have prepared <b>three simple steps to get you started</b>"
        components={{
          b: <b />
        }}
      /> <RocketIcon style={{marginLeft:'.3rem'}}/></p>
    </>
  );
  if(p.customHeader !== undefined) {
    header = p.customHeader;
  }
  return (
    <Segment id="onboarding-checklist" raised={true}>
      {canBeDismissed(p) && <Icon name="close" onClick={onClose} />}
      {header}
      <Divider fitted={true} />
      <QuestionnaireChecklistItem index={1} minimal={p.minimal} />
      <RecordChecklistItem index={2} minimal={p.minimal} />
      <ReportChecklistItem index={3} minimal={p.minimal} />
    </Segment>
  );
}
