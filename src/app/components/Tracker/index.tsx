import React, {useEffect} from 'react';
import { IStore } from 'redux/IStore';
import {IRecordUsage, recordUsage} from 'apollo/modules/user';
import {isUserLoggedIn, isBeneficiaryUser} from 'redux/modules/user';
import { connect } from 'react-redux';

interface IProps extends IRecordUsage {
  isLoggedIn: boolean;
  isBeneficiary: boolean;
}

const Inner = (p: IProps) => {

  useEffect(() => {
    if (!p.isLoggedIn || p.isBeneficiary) {
      return;
    }
    p.recordUsage().catch(console.error);
  }, [p.isLoggedIn, p.isBeneficiary]);

  return <div />;
};

const storeToProps = (state: IStore) => ({
  isLoggedIn: isUserLoggedIn(state.user),
  isBeneficiary: isBeneficiaryUser(state.user),
})

export const Connected = connect(storeToProps)(Inner);
export const Tracker = recordUsage(Connected);
