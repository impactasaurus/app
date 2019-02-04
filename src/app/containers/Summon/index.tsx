import * as React from 'react';
import {isUserLoggedIn, isBeneficiaryUser as isCurrentUserABeneficiary} from 'redux/modules/user';
import { IStore } from 'redux/IStore';
import { Grid } from 'semantic-ui-react';
import {LoggedInUserConfirmation} from 'components/LogoutConfirmation';
import {SummonLoader} from './loader';
const { connect } = require('react-redux');

interface IProps {
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
}))
export class SummonAcceptance extends React.Component<IProps, any> {
  public render() {
    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <Grid container={true} columns={1} id="summonAcceptance">
          <Grid.Column>
            {inner}
          </Grid.Column>
        </Grid>
      );
    };
    if (this.props.isLoggedIn && !this.props.isBeneficiary) {
      return wrapper(<LoggedInUserConfirmation />);
    }
    return wrapper(<SummonLoader id={this.props.match.params.id}/>);
  }
}
