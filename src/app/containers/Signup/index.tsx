import React, { useEffect } from "react";
import { useNavigator } from "redux/modules/url";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { ISignup, signup } from "../../apollo/modules/organisation";
import { IFormOutput, SignupForm } from "../../components/SignupForm";
import { useUser } from "redux/modules/user";

type IProps = ISignup;

const SignupInner = (p: IProps): JSX.Element => {
  const { loggedIn } = useUser();
  const setURL = useNavigator();

  useEffect(() => {
    if (loggedIn) {
      setURL("/");
    }
  }, [loggedIn]);

  const onSubmit = (v: IFormOutput): Promise<void> => {
    return p.signup(v.name, v.email, v.password, v.organisation).then(() => {
      setURL("/login");
    });
  };

  return <SignupForm onFormSubmit={onSubmit} />;
};

const SignupInnerWithWrapper = PageWrapperHoC("Signup", "signup", SignupInner);
export const Signup = signup<IProps>(SignupInnerWithWrapper);
