import * as React from 'react';
import {InviteGenerator} from 'components/InviteGenerator';
import {OrganisationUsers} from 'components/OrganisationUsers';
import {PageWrapperHoC} from 'components/PageWrapperHoC';

export const UsersInner = () => (
  <div>
    <OrganisationUsers />
    <InviteGenerator />
  </div>
);

const Users = PageWrapperHoC('Users', 'users', UsersInner);

export { Users };
