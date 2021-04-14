import React, {useEffect} from 'react';
import {IGetSelf, getSelf} from 'apollo/modules/user';
import { useTranslation } from 'react-i18next';

interface IProps {
  self?: IGetSelf;
}

const Inner = (p: IProps) => {
  const {i18n} = useTranslation();

  useEffect(() => {
    if(!p.self.loading && !p.self.error) {
      const lng = p.self.getSelf.settings.language;
      if (lng && lng !== "und") {
        i18n.changeLanguage(lng);
      } else {
        // use language detector
        i18n.changeLanguage();
      }
    }
  }, [p.self]);

  return <div />;
};

export const Localiser = getSelf(Inner, 'self');
