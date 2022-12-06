import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigator } from "redux/modules/url";
import { useUser } from "redux/modules/user";
import { Button, Message } from "semantic-ui-react";

interface IProps {
  onAgree(): Promise<void>;
  orgID: string;
  success: boolean;
}

export const AddOrg = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const { org: currentOrg } = useUser();
  const setURL = useNavigator();
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

  if (state.success) {
    let body = (
      <span>
        {t(
          "Switch accounts from your user dropdown in the top right of the screen. You may need to log out and back in again to see your new account."
        )}
      </span>
    );
    // this happens when a user doesn't belong to an org before accepting the invite
    if (currentOrg === p.orgID) {
      body = (
        <Button
          onClick={() => setURL("/")}
          primary={true}
          style={{ marginTop: "1em" }}
        >
          {t("Continue")}
        </Button>
      );
    }
    return (
      <Message success={true}>
        <Message.Header>{t("Success")}</Message.Header>
        <div>{t("You have successfully accepted the invitation.")}</div>
        <div>{body}</div>
      </Message>
    );
  }

  // !state.loading to avoid accepting the invite then getting the warning message
  if (currentOrg === p.orgID && !state.loading) {
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
