import * as React from 'react';
import { useTranslation } from 'react-i18next';
import './style.less';

export const Footer = (): JSX.Element => {
  const {t} = useTranslation();
  // eslint-disable-next-line i18next/no-literal-string
  const copyright = <span className="copyright">&copy; {new Date().getFullYear()} Impactasaurus.</span>;
  return (
    <div id="footer">
      <span className="left">
        {copyright}
        <a href="https://impactasaurus.org/terms">{t("Terms of Use")}</a>
        <a href="https://impactasaurus.org/cookie">{t("Cookie Policy")}</a>
        <a href="https://impactasaurus.org/privacy">{t("Privacy Policy")}</a>
      </span>
      <span className="right">
        <a href="https://impactasaurus.org">{t("About")}</a>
        <a href="mailto:support@impactasaurus.org">{t("Contact Us")}</a>
      </span>
    </div>
  );
}
