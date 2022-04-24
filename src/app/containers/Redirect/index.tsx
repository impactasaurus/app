import React, { useEffect } from "react";
import { useNavigator } from "../../redux/modules/url";
import { Loader } from "semantic-ui-react";

interface IProps {
  location: {
    search: string;
  };
}

const getRedirectURL = (p: IProps): string | undefined => {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has("redirect") === false) {
    return undefined;
  }
  return urlParams.get("redirect");
};

export const Redirect = (p: IProps): JSX.Element => {
  const setURL = useNavigator();

  useEffect(() => {
    let redirect = getRedirectURL(p);
    if (redirect === undefined) {
      redirect = "/";
    }
    setURL(redirect);
  }, []);

  return <Loader active={true} inline="centered" />;
};
