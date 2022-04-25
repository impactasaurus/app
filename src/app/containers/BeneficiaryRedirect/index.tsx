import * as React from "react";
import { Grid } from "semantic-ui-react";
import { JTILoader } from "./loader";
import { LoggedInUserConfirmation } from "components/LogoutConfirmation";
import { useUser } from "redux/modules/user";

interface IProps {
  match: {
    params: {
      jti: string;
    };
  };
}

const Wrapper = (p: { children: JSX.Element }): JSX.Element => {
  return (
    <Grid container={true} columns={1} id="benRedirect">
      <Grid.Column>{p.children}</Grid.Column>
    </Grid>
  );
};

export const BeneficiaryRedirect = (p: IProps): JSX.Element => {
  const { loggedIn, beneficiaryUser } = useUser();
  if (loggedIn && !beneficiaryUser) {
    return (
      <Wrapper>
        <LoggedInUserConfirmation />
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <JTILoader jti={p.match.params.jti} />
    </Wrapper>
  );
};
