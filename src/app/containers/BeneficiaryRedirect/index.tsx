import * as React from "react";
import { Grid } from "semantic-ui-react";
import { JTILoader } from "./loader";

interface IProps {
  match: {
    params: {
      jti: string;
    };
  };
}

export const BeneficiaryRedirect = (p: IProps): JSX.Element => {
  return (
    <Grid container={true} columns={1} id="benRedirect">
      <Grid.Column>
        <JTILoader jti={p.match.params.jti} />
      </Grid.Column>
    </Grid>
  );
};
