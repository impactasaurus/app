
import { getUserName } from 'helpers/auth';
import React from 'react';
import './style.less';

export const UserImage = (): JSX.Element => {
  const name = getUserName();
  let initials = "?";
  if (name !== null) {
    initials = name.split(' ').map((s) => s.charAt(0)).join("").toUpperCase();
  }
  if (initials.length > 2) {
    initials = initials.substr(0, 2);
  }

  return (
    <div className="user-image">
      {initials}
    </div>
  );
}
