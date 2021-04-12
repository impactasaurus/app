import React from 'react';
import {IGetSelf, getSelf} from 'apollo/modules/user';
import { useTranslation } from 'react-i18next';

interface IProps {
  self?: IGetSelf;
}

const Inner = (p: IProps) => {
  if(!p.self.loading && !p.self.error) {
    const lng = p.self.getSelf.settings.language;
    if (lng && lng !== "und") {
      const {i18n} = useTranslation();
      i18n.changeLanguage(lng);
    }
  }
  return <div />;
};

export const Localiser = getSelf(Inner, 'self');
