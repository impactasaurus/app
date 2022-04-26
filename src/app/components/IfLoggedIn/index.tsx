import React from "react";
import { useUser } from "redux/modules/user";

interface IProps {
  children?: JSX.Element | JSX.Element[];
}

export const IfLoggedIn = (p: IProps): JSX.Element => {
  const { loggedIn } = useUser();
  return <div>{loggedIn && p.children}</div>;
};
