import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Message } from "semantic-ui-react";
import ReactGA from "react-ga4";

const isIE = (): boolean => {
  // documentMode is an IE specific attribute
  return window.document["documentMode"];
};

export const unsupportedBrowser = (): boolean => {
  return isIE();
};

export const UnsupportedBrowser = (): JSX.Element => {
  useEffect(() => {
    ReactGA.event({
      category: "Browser",
      action: "unsupported",
      label: window.navigator.userAgent,
    });
  }, []);

  const { t } = useTranslation();
  return (
    <div>
      <Message
        error={true}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          width: "500px",
          marginTop: "100px",
        }}
      >
        <Message.Header>{t("Unsupported Browser")}</Message.Header>
        <Message.Content>
          {isIE() && (
            <p>
              {t(
                "We do not support Internet Explorer, as it is an outdated, slow and insecure browser."
              )}
            </p>
          )}
          <p>
            {t(
              "To access Impactasaurus, please switch to an updated, modern browser; we recommend Chrome, Firefox, Safari or Edge."
            )}
          </p>
        </Message.Content>
      </Message>
    </div>
  );
};
