import React from 'react';
import { Icon, Dropdown } from 'semantic-ui-react';
import {UserImage} from './../UserImage';
import {Link} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUserName, getOrganisation } from 'helpers/auth';
import {IGetOrgsResult, getOrganisations, IUserOrg} from 'apollo/modules/organisation';

interface IProps {
  logOut: () => void;
  data?: IGetOrgsResult;
}

const orgs = (data?: IGetOrgsResult, excludeCurrent = false): IUserOrg[] => {
  if (data && data.getOrganisations) {
    const activeOrgID = getOrganisation();
    return data.getOrganisations.filter((o) => !excludeCurrent || o.id !== activeOrgID);
  }
  return [];
}

const ActiveOrg = (p: {data?: IGetOrgsResult}) => {
  const oo = orgs(p.data);
  const activeOrgID = getOrganisation();
  const activeOrg = oo.find((o) => o.id === activeOrgID);
  if (activeOrg) {
    return <span className="active-org elipsis-overflow">{activeOrg.name}</span>;
  }
  return <span />;
};

const ProfileMenuInner = (p: IProps): JSX.Element => {
  const {t} = useTranslation();
  const oo = orgs(p.data, true);
  const orgSelectionUI: JSX.Element[] = oo.map((o) => <Dropdown.Item key={o.id} className="org-option">{o.name}</Dropdown.Item>)
  return (
    <Dropdown item trigger={<UserImage />} id="user-menu">
      <Dropdown.Menu>
        <Dropdown.Item id="user-profile-dd-item" className="not-clickable">
          <div style={{display: "flex"}}>
            <UserImage />
            <span style={{display: "flex", flexDirection: "column"}}>
              <span className="user-name elipsis-overflow">{getUserName()}</span>
              <ActiveOrg data={p.data} />
            </span>
          </div>
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/profile" ><Icon name="user circle" className="required"/> {t('Profile')}</Dropdown.Item>
        {oo.length > 0 && ([
          <Dropdown.Item key="org-header" className="not-clickable"><Icon name="exchange" className="required"/> {t('Change Account:')}</Dropdown.Item>,
          ...orgSelectionUI
        ])}
        <Dropdown.Divider />
        <Dropdown.Item href="https://impactasaurus.org/support/" target='_blank' ><Icon name="life ring" className="required"/> {t('Help')}</Dropdown.Item>
        <Dropdown.Item href="mailto:feedback@impactasaurus.org?subject=Feedback" ><Icon name="comment" className="required"/> {t('Send Feedback')}</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={p.logOut}><Icon name="log out" className="required"/> {t('Log Out')}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};


export const ProfileMenu = getOrganisations<IProps>(ProfileMenuInner);
