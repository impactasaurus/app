import React, { useEffect, useState } from "react";
import { shouldLoadBranding, loadBrandLogo } from "theme/branding";
import SVG from "./logo.inline.svg";
import "./style.less";

const Logo = (): JSX.Element => {
  const [loadBranding, setLoadBranding] = useState(shouldLoadBranding());
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    // due to the async nature, this component may be unmounted before it completes.
    // this happens as users transition from not logged in to logged in / beneficiary
    let unmounted = false;
    if (loadBranding) {
      loadBrandLogo()
        .then((logo) => {
          if (!unmounted) {
            // logo is a fn, if we pass it to setLogo, react will execute it
            // to work around this, pass logo in a fn
            setLogo(() => logo);
          }
        })
        .catch(() => {
          if (!unmounted) {
            console.log(`no logo for configured for subdomain`);
            setLoadBranding(false);
          }
        });
    }
    return () => {
      unmounted = true;
    };
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
