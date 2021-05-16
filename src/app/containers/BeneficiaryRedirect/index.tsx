import * as React from "react";
import {
  isUserLoggedIn,
  isBeneficiaryUser as isCurrentUserABeneficiary,
} from "redux/modules/user";
import { IStore } from "redux/IStore";
import { Grid } from "semantic-ui-react";
import { JTILoader } from "./loader";
import { LoggedInUserConfirmation } from "components/LogoutConfirmation";
const { connect } = require("react-redux");

interface IProps {
  match: {
    params: {
      jti: string;
    };
  };
  isLoggedIn?: boolean;
  isBeneficiary?: boolean;
}

@connect((state: IStore) => ({
  isLoggedIn: isUserLoggedIn(state.user),
  isBeneficiary: isCurrentUserABeneficiary(state.user),
}))
export class BeneficiaryRedirect extends React.Component<IProps, any> {
  public render() {
    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <Grid container={true} columns={1} id="benRedirect">
          <Grid.Column>{inner}</Grid.Column>
        </Grid>
      );
    };
    if (this.props.isLoggedIn && !this.props.isBeneficiary) {
      return wrapper(<LoggedInUserConfirmation />);
    }
    return wrapper(<JTILoader jti={this.props.match.params.jti} />);
  }
}
