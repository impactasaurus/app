import { getOrganisation } from "helpers/auth";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Message } from "semantic-ui-react";

interface IProps {
  onAgree(): Promise<void>;
  orgID: string;
  success: boolean;
}

export const AddOrg = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const [state, setState] = useState<{
    loading: boolean;
    error: boolean;
    success: boolean;
  }>({ error: false, loading: false, success: p.success });

  const onAccept = () => {
    if (state.loading) {
      return;
    }
    setState({ error: false, loading: true, success: false });
    p.onAgree().catch(() => {
      setState({ error: true, loading: false, success: false });
    });
  };

  const currentOrg = getOrganisation();
  if (currentOrg === p.orgID) {
    return (
      <Message warning={true}>
        <Message.Header>
          {t("You already belong to this account")}
        </Message.Header>
        <div>
          {t(
            "It seems you already belong to the account associated with this invitation"
          )}
        </div>
      </Message>
    );
  }

  if (state.success) {
    return (
      <Message success={true}>
        <Message.Header>{t("Success")}</Message.Header>
        <div>{t("You have successfully accepted the invitation.")}</div>
        <div>
          {t(
            "Switch accounts from your user dropdown in the top right of the screen."
          )}
        </div>
      </Message>
    );
  }

  return (
    <>
      <p>{t("Would you like to accept this invitation?")}</p>
      <Button
        onClick={onAccept}
        loading={state.loading}
        disabled={state.loading}
        negative={state.error}
        primary={!state.error}
      >
        {t("Accept")}
      </Button>
      {state.error && <p>{t("Failed to accept invite")}</p>}
    </>
  );
};
