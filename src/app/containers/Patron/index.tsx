import React, { useState } from "react";
import { IGetOrgResult, getOrganisation } from "apollo/modules/organisation";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { OrganisationDon } from "components/OrganisationDon";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { PatronLogo } from "components/PatronOnly";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Card, CardProps, Checkbox } from "semantic-ui-react";
import "./style.less";

interface IProps {
  org?: IGetOrgResult;
}

const prices = [5, 10, 20, 40, 100];

const PatronView = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div>
      <div>
        {t(
          "Thank you for supporting the running and development of Impactasaurus"
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

const takeToPay = (size: number, yearly: boolean): void => {
  const links = {
    "0:true": "https://buy.stripe.com/fZe6rffaGdRs1LqeUW",
    "1:true": "https://buy.stripe.com/9AQaHv2nUaFgahW4gk",
    "2:true": "https://buy.stripe.com/fZebLz2nU14G89O28e",
    "3:true": "https://buy.stripe.com/28o7vj1jQbJkgGk8wE",
    "4:true": "https://buy.stripe.com/dR6g1Pd2ydRsbm05ku",
    "0:false": "https://buy.stripe.com/eVaeXL4w228KgGkcMP",
    "1:false": "https://buy.stripe.com/cN2g1P7IecNoahW8wB",
    "2:false": "https://buy.stripe.com/14k02R8Mi14Geyc8wD",
    "3:false": "https://buy.stripe.com/eVaaHv6Ea3cO1LqbIR",
    "4:false": "https://buy.stripe.com/3cseXL8Mi6p00HmbIT",
  };
  const link = links[size + ":" + yearly];
  window.location.href = link;
};

const DonationForm = (): JSX.Element => {
  const { t } = useTranslation();
  const [size, setSize] = useState<number>(undefined);
  const [yearly, setYearly] = useState<boolean>(true);
  const sizes: CardProps[] = [
    {
      header: "Micro",
      description: "Less than £10,000",
      onClick: () => setSize(0),
      className: size == 0 ? "size-selected" : "",
    },
    {
      header: "Small",
      description: "£10,000 to £100,000",
      onClick: () => setSize(1),
      className: size == 1 ? "size-selected" : "",
    },
    {
      header: "Medium",
      description: "£100,000 to £1m",
      onClick: () => setSize(2),
      className: size == 2 ? "size-selected" : "",
    },
    {
      header: "Large",
      description: "£1m to £10m",
      onClick: () => setSize(3),
      className: size == 3 ? "size-selected" : "",
    },
    {
      header: "Major",
      description: "£10m+",
      onClick: () => setSize(4),
      className: size == 4 ? "size-selected" : "",
    },
  ];
  const costString = () => {
    const raw = prices[size] * (yearly ? 0.9 : 1);
    return raw == Math.round(raw) ? raw : raw.toFixed(2);
  };
  const poundSymbol = "£";
  return (
    <div>
      <div id="charity-size-selector">
        <p>
          {t(
            "Patron pricing is based on your income (using NVCO's classification), please select the box which best fits your charity"
          )}
          :
        </p>
        <Card.Group items={sizes} itemsPerRow={5} />
      </div>
      <div id="price-selector">
        <p style={{ fontStyle: "italic", marginTop: "1em" }}>
          {t(
            "We know times are tough - if you cannot afford the prices detailed here, but still wish to support our work, please get in touch"
          )}
        </p>
        {size != undefined && (
          <div>
            <div
              style={{
                display: "inline-flex",
                marginTop: "1em",
                marginBottom: "1em",
              }}
            >
              <span style={{ marginRight: "0.5em" }}>
                {t("Billed Monthly")}
              </span>
              <Checkbox
                toggle
                defaultChecked={true}
                onChange={() => setYearly(!yearly)}
              />
              <span style={{ marginLeft: "0.5em" }}>{t("Billed Yearly")}</span>
            </div>
            <h2>
              <span>{poundSymbol}</span>
              <span style={{ fontSize: "2em" }}>{costString()}</span>
              <span>/{t("month")}</span>
            </h2>
            <Button
              primary={true}
              style={{ marginTop: "2em" }}
              onClick={() => takeToPay(size, yearly)}
            >
              {t("Select")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const NonPatronView = (): JSX.Element => {
  const { t } = useTranslation();
  const [cont, setCont] = useState(false);
  if (cont) {
    return <DonationForm />;
  }
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
          "If you love Impactasaurus, please consider supporting our work by becoming a Patron."
        )}
      </p>
      <p>
        {t(
          "Patrons provide recurring financial support towards the running and development costs of Impactasaurus."
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
      <Button onClick={() => setCont(true)} primary={true}>
        {t("Tell me more...")}
      </Button>
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
