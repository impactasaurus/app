import React from "react";
import { Redirect as R } from "react-router-dom";

interface IProps {
  location: {
    search: string;
  };
}

const getRedirectURL = (p: IProps): string | undefined => {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has("redirect") === false) {
    return "/";
  }
  return urlParams.get("redirect");
};

export const Redirect = (p: IProps): JSX.Element => (
  <R to={getRedirectURL(p)} />
);
