import React, { useEffect, useState } from "react";
import { shouldLoadBranding, loadBrandLogo } from "theme/branding";
import SVG from "./logo.inline.svg";
import "./style.less";

const Logo = (): JSX.Element => {
  const [loadBranding, setLoadBranding] = useState(shouldLoadBranding());
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (loadBranding) {
      loadBrandLogo()
        .then((logo) => {
          // logo is a fn, if we pass it to setLogo, react will execute it
          // to work around this, pass logo in a fn
          setLogo(() => logo);
        })
        .catch(() => {
          console.log(`no logo for configured for subdomain`);
          setLoadBranding(false);
        });
    }
  }, []);

  if (loadBranding) {
    const BrandedLogo = logo;
    if (BrandedLogo) {
      return <BrandedLogo />;
    }
    return <span />;
  }
  const name = "Impactasaurus";
  return (
    <span className="impactasaurus-logo">
      <SVG />
      <span className="title">{name}</span>
    </span>
  );
};

export default Logo;
