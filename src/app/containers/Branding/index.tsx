import React from "react";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { useTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import Logo from "components/Logo";
import { FormField } from "components/FormField";
import { Swatch } from "components/Swatch";
import { SeriesType, getColorScheme } from "theme/chartStyle";
import { PatronOnly } from "components/PatronOnly";

const Spacer = () => (
  <span
    style={{
      display: "inline-block",
      width: "1px",
      marginLeft: "10px",
      marginRight: "10px",
      backgroundColor: "lightgray",
      height: "1em",
    }}
  />
);

const SwatchHolder = ({
  label,
  children,
}: {
  label: string;
  children: JSX.Element[] | JSX.Element;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "10px",
    }}
  >
    <span style={{ marginRight: "0.6em" }}>{label}:</span>
    {children}
  </div>
);

const BrandingInner = (): JSX.Element => {
  const { t } = useTranslation();

  const graphColours = new Set<string>();
  for (let ct = 1; ct < 4; ct++) {
    const cc = getColorScheme(ct, SeriesType.INDEPENDENT);
    cc.forEach((c) => graphColours.add(c));
  }

  return (
    <Form className="screen" id="branding-form">
      <PatronOnly style={{ paddingBottom: "30px" }}>
        <FormField label={t("Logo")} inputID="nothing">
          <div
            style={{
              backgroundColor: "var(--brand-color)",
              padding: "10px",
              display: "inline-block",
              borderRadius: "5px",
            }}
          >
            <Logo />
          </div>
        </FormField>
        <FormField label={t("Web Address")} inputID="nothing">
          <span>{window.location.hostname}</span>
        </FormField>
        <FormField label={t("Colours")} inputID="nothing">
          <SwatchHolder label={t("Brand")}>
            <Swatch color="var(--brand-color)" label={t("Brand Colour")} />
            <Spacer />
            <Swatch
              color="var(--brand-color-light)"
              label={t("Light Brand Colour")}
            />
            <Swatch
              color="var(--brand-color-lighter)"
              label={t("Lighter Brand Colour")}
            />
            <Spacer />
            <Swatch
              color="var(--brand-color-dark)"
              label={t("Dark Brand Colour")}
            />
            <Swatch
              color="var(--brand-color-darker)"
              label={t("Darker Brand Colour")}
            />
          </SwatchHolder>
          <SwatchHolder label={t("Chart")}>
            {Array.from(graphColours.values()).map((c) => (
              <Swatch key={c} color={c} />
            ))}
          </SwatchHolder>
          <SwatchHolder label={t("Stacked")}>
            {getColorScheme(3, SeriesType.SCALE).map((c) => (
              <Swatch key={c} color={c} />
            ))}
          </SwatchHolder>
        </FormField>
        <div style={{ marginTop: "2em" }}>
          <a href="mailto:support@impactasaurus.org">
            {t("Contact us to tweak your branding")}
          </a>
        </div>
      </PatronOnly>
    </Form>
  );
};

export const Branding = PageWrapperHoC("Branding", "branding", BrandingInner);
