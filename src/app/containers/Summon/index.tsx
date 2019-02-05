import * as React from 'react';
import {isUserLoggedIn, isBeneficiaryUser as isCurrentUserABeneficiary} from 'redux/modules/user';
import { IStore } from 'redux/IStore';
import {LoggedInUserConfirmation} from 'components/LogoutConfirmation';
import {SummonForm} from './form';
import {bindActionCreators} from 'redux';
import {IURLConnector, setURL} from 'redux/modules/url';
import {ISummonAcceptanceMutation} from 'apollo/modules/summon';
import {newMeetingFromSummon} from '../../apollo/modules/summon';
import {PageWrapperHoC} from '../../components/PageWrapperHoC';
const { connect } = require('react-redux');
const ReactGA = require('react-ga');
const strings = require('./../../../strings.json');

interface IProps extends IURLConnector, ISummonAcceptanceMutation {
  match: {
    params: {
      id: string,
    },
  };
  isLoggedIn?: boolean;
  isBeneficiary?: boolean;
}

@connect((state: IStore) => ({
  isLoggedIn: isUserLoggedIn(state.user),
  isBeneficiary: isCurrentUserABeneficiary(state.user),
}), (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class SummonAcceptanceInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.logResult = this.logResult.bind(this);
    this.createRecord = this.createRecord.bind(this);
  }

  private logResult(label: string) {
    ReactGA.event({
      category: 'summon',
      action: 'acceptance',
      label,
    });
  }

  private createRecord(beneficiaryID: string): Promise<void> {
    return this.props.newMeetingFromSummon(this.props.match.params.id, beneficiaryID)
      .then((jti) => {
        this.logResult('success');
        this.props.setURL(`/jti/${jti}`);
      })
      .catch((e: Error) => {
        this.logResult(e.message);
        if (e.message.includes('expired')) {
          throw new Error('This link has expired. Please request a new link');
        } else if (e.message.includes('exhausted')) {
          throw new Error('This link has been exhausted. Please request a new link');
        } else if (e.message.includes('found')) {
          throw new Error('We did not recognise this link. Please request a new link');
        } else {
          throw new Error(`Loading questionnaire failed. ${strings.formFailureGeneric}`);
        }
      });
  }

  public render() {
    if (this.props.isLoggedIn && !this.props.isBeneficiary) {
      return <LoggedInUserConfirmation />;
    }
    return <SummonForm onBeneficiarySelect={this.createRecord}/>;
  }
}

export const SummonAcceptance = newMeetingFromSummon(PageWrapperHoC<IProps>('Welcome', 'summonAcceptance', SummonAcceptanceInner));
