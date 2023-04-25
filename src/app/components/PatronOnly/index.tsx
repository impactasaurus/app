import React from "react";
import { IGetOrgResult, getOrganisation } from "apollo/modules/organisation";
import { Icon, Loader } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { useNavigator } from "redux/modules/url";
import "./style.less";

interface IProps {
  org?: IGetOrgResult;
  children?: JSX.Element | JSX.Element[];
  style?: React.CSSProperties;
}

export const PatronLogo = (p: { style?: React.CSSProperties }): JSX.Element => (
  <Icon name="heart" style={p.style} />
);

const Inner = (p: IProps) => {
  const { t } = useTranslation();
  const setURL = useNavigator();
  if (p.org.loading) {
    return <Loader active={true} inline="centered" />;
  }
  if (p?.org?.getOrganisation?.don) {
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
          cursor: "pointer",
        }}
        onClick={() => setURL("/settings/patron")}
      >
        <PatronLogo />
        {t("Patrons Only")}
      </div>
      <div
        className="patron-body"
        style={{ border: "5px solid #935D8C", borderRadius: "5px", ...p.style }}
      >
        {p.children}
      </div>
    </div>
  );
};

export const PatronOnly = getOrganisation<IProps>(Inner, "org");
