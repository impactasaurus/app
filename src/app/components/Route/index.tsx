import React from "react";
import {
  Redirect,
  Route as R,
  RouteProps,
  useLocation,
} from "react-router-dom";
import { useLogout, useUser } from "redux/modules/user";
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
  const logout = useLogout();
  const { pathname, search } = useLocation();

  const render = (props) => {
    if (user.loggedIn) {
      if (user.org && userComponent !== undefined) {
        return userComponent;
      }
      if (user.beneficiaryUser && !beneficiaryAllowed) {
        logout();
        return <div />;
      }
      if (!user.org && !user.beneficiaryUser && !publicAccess) {
        return <NoOrgBlocker />;
      }
    } else {
      if (!publicAccess) {
        const redirectURL = pathname + search;
        return (
          <Redirect to={`/login?redirect=${encodeURIComponent(redirectURL)}`} />
        );
      }
    }
    return <Component {...props} />;
  };

  return <R {...rest} render={render} />;
};

export default Route;
