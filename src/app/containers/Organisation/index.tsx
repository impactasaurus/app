import React from 'react';
import {OrganisationSettings} from 'components/OrganisationSettings';
import {OrganisationDon} from 'components/OrganisationDon';
import { PageWrapperHoC } from 'components/PageWrapperHoC';
import { useTranslation } from 'react-i18next';

const OrganisationInner = () => {
  const {t} = useTranslation();
  return (
    <>
    <OrganisationDon />
    <h3>{t("Settings")}</h3>
    <p>{t("The following settings apply to every user in your organisation:")}</p>
    <OrganisationSettings />
    </>
  );
}

// t("Organisation")
const Organisation = PageWrapperHoC("Organisation", "organisation", OrganisationInner);
export { Organisation };
