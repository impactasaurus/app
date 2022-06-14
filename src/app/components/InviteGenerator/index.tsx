import React, { useEffect, useState } from "react";
import { Modal } from "semantic-ui-react";
import { generateInvite, IGenerateInvite } from "apollo/modules/organisation";
import { Error } from "components/Error";
import { useTranslation } from "react-i18next";
import * as config from "../../../../config/main";
import { CopyBox } from "components/CopyBox";

interface IProps extends IGenerateInvite {
  onClosed?: () => void;
}

const InviteGeneratorInner = (p: IProps) => {
  const [inviteID, setInviteID] = useState<string>(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setError(false);
    setLoading(true);
    p.generateInvite()
      .then((invite: string) => {
        setInviteID(invite);
        setError(false);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError(true);
        setLoading(false);
      });
  }, []);

  const onClose = () => {
    setInviteID(undefined);
    if (p.onClosed !== undefined) {
      p.onClosed();
    }
  };

  if (inviteID) {
    const url = `${config.app.root}/invite/${inviteID}`;
    const modalContent = (
      <div style={{ margin: "1em" }}>
        <p>
          <span>
            {t(
              "This link allows others to join your Impactasaurus. Simply send it to your colleagues"
            )}
          </span>
        </p>
        <p>
          <CopyBox text={url} loading={loading} />
        </p>
      </div>
    );
    return (
      <Modal
        header={t("Your invite link")}
        content={modalContent}
        actions={[t("Close")]}
        open={true}
        onClose={onClose}
      />
    );
  }
  if (error) {
    return <Error text={t("Failed to generate invite")} />;
  }
  return <div />;
};

const InviteGenerator = generateInvite<IProps>(InviteGeneratorInner);
export { InviteGenerator };
