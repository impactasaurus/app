import React, { useState } from "react";
import { InviteGenerator } from "components/InviteGenerator";
import { OrganisationUsers } from "components/OrganisationUsers";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { Button, Responsive } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { TooltipButton } from "components/TooltipButton";

const UsersInner = (): JSX.Element => {
  const [showInviteLink, setShowInviteLink] = useState(false);
  const { t } = useTranslation();

  const newClicked = (): void => {
    setShowInviteLink(true);
  };

  const linkGenerated = (): void => {
    setShowInviteLink(false);
  };

  const newButton = (
    <span
      className="title-holder"
      style={{ position: "absolute", right: "1rem", marginTop: "0.5rem" }}
    >
      <Responsive
        as={Button}
        minWidth={620}
        icon="plus"
        content={t("Invite User")}
        primary={true}
        onClick={newClicked}
        loading={showInviteLink}
      />
      <Responsive
        as={TooltipButton}
        maxWidth={619}
        buttonProps={{
          icon: "plus",
          primary: true,
          onClick: newClicked,
          loading: showInviteLink,
        }}
        tooltipContent={t("Invite User")}
      />
    </span>
  );
  const inviteLink = <InviteGenerator onClosed={linkGenerated} />;
  return (
    <div>
      {newButton}
      <h1>{t("Users")}</h1>
      {showInviteLink && inviteLink}
      <OrganisationUsers />
    </div>
  );
};

// t('Users')
const Users = MinimalPageWrapperHoC("Users", "users", UsersInner);

export { Users };
