import React from 'react';
import {isUserLoggedIn} from 'redux/modules/user';
import { IStore } from 'redux/IStore';
import {PageWrapperHoC} from 'components/PageWrapperHoC';
import { Loader, Message } from 'semantic-ui-react';
import {IURLConnector, UrlConnector} from 'redux/modules/url';
import {acceptInvite, checkInvite, IAcceptInvite, ICheckInvite} from 'apollo/modules/organisation';
import {IFormOutput, SignupForm} from 'components/SignupForm';
import {Error} from 'components/Error';
import {connect} from 'react-redux';
import { useTranslation } from 'react-i18next';

interface IProps extends IURLConnector, IAcceptInvite {
  match: {
    params: {
      id: string,
    },
  };
  isLoggedIn?: boolean;
  data?: ICheckInvite;
}

const InviteInner = (p: IProps) => {

  const onFormSubmit = (v: IFormOutput): Promise<void> => {
    return p.acceptInvite(v.name, v.email, v.password, p.match.params.id)
      .then(() => {
        p.setURL('/login');
      });
  };

  const {t} = useTranslation();
  if (p.isLoggedIn) {
    return (
      <Message error={true}>
        <div>{t("Please logout to use this invite link.")}</div>
      </Message>
    );
  }
  if (p.data.error) {
    if (p.data.error.message.includes('expired')) {
      return (
        <Message error={true}>
          <Message.Header>{t("Invite Has Expired")}</Message.Header>
          <div>{t("Please request a new one.")}</div>
        </Message>
      );
    }
    if (p.data.error.message.includes('found')) {
      return (
        <Message error={true}>
          <Message.Header>{t("Unknown Invite")}</Message.Header>
          <div>{t("We did not recognize this invite. Please ensure the URL is correct.")}</div>
        </Message>
      );
    }
    return <Error text={t("Failed to load invite")} />;
  }
  if (p.data.loading) {
    return <Loader active={true} inline="centered" />;
  }
  return (
    <SignupForm onFormSubmit={onFormSubmit} collectOrgName={false}/>
  );
}

const storeToProps = (state: IStore) => ({
  isLoggedIn: isUserLoggedIn(state.user),
});

const InviteWithChecker = checkInvite<IProps>((p: IProps) => p.match.params.id)(InviteInner);
const InviteWithAccepter = acceptInvite<IProps>(InviteWithChecker);
const InviteConnected = connect(storeToProps, UrlConnector)(InviteWithAccepter);
// t("Welcome")
export const Invite = PageWrapperHoC<IProps>('Welcome', 'invite', InviteConnected);
