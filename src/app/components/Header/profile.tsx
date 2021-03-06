import React from 'react';
import { Icon, Dropdown } from 'semantic-ui-react';
import {UserImage} from './../UserImage';
import {Link} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUserName } from 'helpers/auth';

interface IProps {
  logOut: () => void;
}

export const ProfileMenu = (p: IProps): JSX.Element => {
  const {t} = useTranslation();
  return (
    <Dropdown item trigger={<UserImage />} id="user-menu">
      <Dropdown.Menu>
        <Dropdown.Item id="user-profile-dd-item">
          <div>
            <UserImage />
            <span className="user-name">{getUserName()}</span>
          </div>
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/profile" ><Icon name="user circle" className="required"/> {t('Profile')}</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="https://impactasaurus.org/support/" target='_blank' ><Icon name="life ring" className="required"/> {t('Help')}</Dropdown.Item>
        <Dropdown.Item href="mailto:feedback@impactasaurus.org?subject=Feedback" ><Icon name="comment" className="required"/> {t('Send Feedback')}</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={p.logOut}><Icon name="log out" className="required"/> {t('Log Out')}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
