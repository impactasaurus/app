import { PageWrapperHoC } from "components/PageWrapperHoC";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Loader, Message } from "semantic-ui-react";

interface IProps {
  match: {
    params: {
      b64url: string;
    };
  };
}

const inner = (p: IProps): JSX.Element => {
  const [url, setURL] = useState<URL>();
  const [err, setError] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const s = atob(decodeURIComponent(p.match.params.b64url));
      const u = new URL(s);
      setURL(u);
    } catch (e) {
      setError(true);
    }
  }, []);

  const redirect = () => {
    window.location.href = url.toString();
  };

  if (err) {
    return (
      <Message error={true}>
        <Message.Header>{t("Whoops, something went wrong.")}</Message.Header>
        <Message.Content>
          <p>{t("Please contact your facilitator.")}</p>
          <p>
            {t(
              "Error: The external link used within the questionnaire sequence isn't valid."
            )}
          </p>
        </Message.Content>
      </Message>
    );
  }

  if (!url) {
    return <Loader active={true} inline="centered" />;
  }

  return (
    <>
      <p>
        {t(
          "The remaining questions are hosted at {host}, would you like to continue?",
          { host: url.host }
        )}
      </p>
      <Button primary style={{ marginTop: "1em" }} onClick={redirect}>
        {t("Continue")}
      </Button>
    </>
  );
};

// t("Notice")
export const ExternalLink = PageWrapperHoC("Notice", "ext-link", inner);
