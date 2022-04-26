import React from "react";
import { Redirect, Route as R, RouteProps } from "react-router-dom";
import { useUser } from "redux/modules/user";
import { BeneficiaryBlocker } from "./benBlocker";
import { NoOrgBlocker } from "./noOrgBlocker";

interface IProps {
  public?: boolean; // default = false
  beneficiary?: boolean; // default = false
  user?: JSX.Element; // shown to users if they visit the page
}

const Route = (p: IProps & RouteProps): React.ReactElement => {
  const {
    component: Component,
    public: publicAccess = false,
    beneficiary: beneficiaryAllowed = false,
    user: userComponent,
    ...rest
  } = p;
  const user = useUser();

  const render = (props) => {
    if (user.loggedIn) {
      if (user.org && userComponent !== undefined) {
        return userComponent;
      }
      if (user.beneficiaryUser && !beneficiaryAllowed) {
        return <BeneficiaryBlocker />;
      }
      if (!user.org && !user.beneficiaryUser && !publicAccess) {
        return <NoOrgBlocker />;
      }
    } else {
      if (!publicAccess) {
        return <Redirect to={"/login"} />;
      }
    }
    return <Component {...props} />;
  };

  return <R {...rest} render={render} />;
};

export default Route;
