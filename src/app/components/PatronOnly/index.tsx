import { IGetOrgResult, getOrganisation } from "apollo/modules/organisation";
import React from "react";
import { Icon } from "semantic-ui-react";
import "./style.less";
import { useTranslation } from "react-i18next";

interface IProps {
  org?: IGetOrgResult;
  children?: JSX.Element | JSX.Element[];
  style?: React.CSSProperties;
}

export const PatronLogo = (): JSX.Element => <Icon name="heart" />;

const Inner = (p: IProps) => {
  const { t } = useTranslation();
  if (false && p?.org?.getOrganisation?.don) {
    return p.children;
  }
  return (
    <div className="patron-only">
      <div
        style={{
          backgroundColor: "#935D8C",
          color: "white",
          display: "inline-block",
          padding: "5px 10px 0px 10px",
          borderRadius: "5px 5px 0px 0px",
        }}
      >
        <PatronLogo />
        {t("Patrons Only")}
      </div>
      <div
        style={{ border: "5px solid #935D8C", borderRadius: "5px", ...p.style }}
      >
        {p.children}
      </div>
    </div>
  );
};

export const PatronOnly = getOrganisation<IProps>(Inner, "org");
