import * as React from "react";
import SVG from "./logo.inline.svg";
import "./style.less";

const Logo = (): JSX.Element => {
  return (
    <span className="localhost-logo">
      <SVG />
      {/* eslint-disable-next-line i18next/no-literal-string */}
      <span className="title">Impactasaurus LH</span>
    </span>
  );
};

export default Logo;
