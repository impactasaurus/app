import React, { useState } from "react";
import { Icon, Dropdown, Loader } from "semantic-ui-react";
import { UserImage } from "./../UserImage";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { refreshToken } from "helpers/auth";
import {
  IGetOrgsResult,
  getOrganisations,
  IUserOrg,
  setOrganisation,
  ISetOrganisation,
} from "apollo/modules/organisation";
import { useSetJWT, useUser } from "redux/modules/user";
import "./profile.less";

interface IProps extends ISetOrganisation {
  logOut: () => void;
  data?: IGetOrgsResult;
}

const orgs = (
  activeOrgID: string,
  data?: IGetOrgsResult,
  excludeCurrent = false
): IUserOrg[] => {
  if (data && data.getOrganisations) {
    return data.getOrganisations
      .filter((o) => !excludeCurrent || o.id !== activeOrgID)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  return [];
};

const ActiveOrg = (p: { data?: IGetOrgsResult; org: string }): JSX.Element => {
  const activeOrg = (p?.data?.getOrganisations || []).find(
    (o) => o.id === p.org
  );
  if (activeOrg) {
    return (
      <span className="active-org elipsis-overflow">{activeOrg.name}</span>
    );
  }
  return <span />;
};

const ProfileMenuInner = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const setJWT = useSetJWT();
  const { name, org } = useUser();
  const oo = orgs(org, p.data, true);
  const [changingOrg, setChangingOrg] = useState(false);
  const [changingOrgErr, setChangingOrgErr] = useState(false);
  const setActiveOrg = (id: string): (() => void) => {
    return () => {
      setChangingOrg(true);
      setChangingOrgErr(false);
      p.setOrganisation(id)
        .then(() => {
          return refreshToken();
        })
        .then((token) => {
          setJWT(token);
        })
        .then(() => {
          // hard refresh to homepage to clear cache and avoid permission issues
          window.location.href = "/";
        })
        .catch((e) => {
          console.error(e);
          setChangingOrg(false);
          setChangingOrgErr(true);
        });
    };
  };
  const orgSelectionUI: JSX.Element[] = oo.map((o) => (
    <Dropdown.Item
      key={o.id}
      className="org-option"
      onClick={setActiveOrg(o.id)}
    >
      {o.name}
    </Dropdown.Item>
  ));
  return (
    <Dropdown
      item
      trigger={
        changingOrg ? (
          <Loader
            inline="centered"
            active={true}
            size="small"
            inverted={true}
          />
        ) : (
          <UserImage />
        )
      }
      id="user-menu"
      pointing="left"
      className={changingOrgErr ? "error" : ""}
    >
      <Dropdown.Menu>
        <Dropdown.Item id="user-profile-dd-item" className="not-clickable">
          <div style={{ display: "flex" }}>
            <UserImage />
            <span style={{ display: "flex", flexDirection: "column" }}>
              <span className="user-name elipsis-overflow">{name}</span>
              <ActiveOrg data={p.data} org={org} />
            </span>
          </div>
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/profile">
          <Icon name="user circle" className="required" /> {t("Profile")}
        </Dropdown.Item>
        {oo.length > 0 && [
          <Dropdown.Item key="org-header" className="not-clickable">
            <Icon name="exchange" className="required" /> {t("Change Account:")}
          </Dropdown.Item>,
          <div id="org-options" key="org-options">
            {...orgSelectionUI}
          </div>,
        ]}
        <Dropdown.Divider />
        <Dropdown.Item
          href="https://impactasaurus.org/support/"
          target="_blank"
        >
          <Icon name="life ring" className="required" /> {t("Help")}
        </Dropdown.Item>
        <Dropdown.Item href="mailto:feedback@impactasaurus.org?subject=Feedback">
          <Icon name="comment" className="required" /> {t("Send Feedback")}
        </Dropdown.Item>
        <Dropdown.Item
          href="https://donate.stripe.com/aEUeXLd2y5kW1LqcMN"
          target="_blank"
        >
          <Icon name="heart" className="required" /> {t("Donate")}
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={p.logOut}>
          <Icon name="log out" className="required" /> {t("Log Out")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const ProfileMenu = setOrganisation<IProps>(
  getOrganisations<IProps>(ProfileMenuInner)
);
