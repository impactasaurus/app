import { IGetOrgResult, getOrganisation } from "apollo/modules/organisation";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { OrganisationDon } from "components/OrganisationDon";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { PatronLogo } from "components/PatronOnly";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

interface IProps {
  org?: IGetOrgResult;
}

const PatronView = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div>
      <div>
        {t(
          "Thank you for supporting the running and development of Impactasaurus!"
        )}
      </div>
      <PatronLogo
        style={{
          color: "var(--impactasaurus-purple)",
          fontSize: "2em",
          marginTop: "0.6em",
        }}
      />
      <OrganisationDon />
    </div>
  );
};

const NonPatronView = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        maxWidth: "400px",
        display: "inline-flex",
        flexDirection: "column",
      }}
    >
      <p>
        {t(
          "We hope you love Impactasaurus as much as we love helping charities. If so, please consider supporting our work by becoming a Patron."
        )}
      </p>
      <p>
        {t(
          "Patrons provide financial support towards the running and development costs of Impactasaurus."
        )}
      </p>
      <p>
        <Trans
          defaults="To say thanks, you will get access to exclusive features, such as <bLink>custom branding</bLink>."
          components={{
            bLink: <Link to="/settings/branding" />,
          }}
        />
      </p>
      <Button primary={true}>{t("Tell me more...")}</Button>
    </div>
  );
};

const PatronInner = (p: IProps): JSX.Element => {
  if (p.org.getOrganisation.don) {
    return <PatronView />;
  }
  return <NonPatronView />;
};

// t("subscription status")
const PatronWithSpinner = ApolloLoaderHoC(
  "subscription status",
  (p: IProps) => p.org,
  PatronInner
);
const PatronWithData = getOrganisation(PatronWithSpinner, "org");
// t("Patron")
export const Patron = PageWrapperHoC("Patron", "patron", PatronWithData);
