import React, {useState} from 'react';
import {Button, ButtonProps} from 'semantic-ui-react';
import {getOrganisation, IGetOrgResult} from 'apollo/modules/organisation';
import { getToken } from 'helpers/auth';
import { useTranslation } from 'react-i18next';
import * as appConfig from '../../../../config/main';

interface IProps {
  org?: IGetOrgResult;
}

const OrganisationDonInner = (p: IProps) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>(undefined);
  const {t} = useTranslation();

  const redirect = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(undefined);

    fetch(`${appConfig.app.api}/v1/don/redirect?return=${window.location.href}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      window.location.href = data.url;
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
      setError(t('Failed to redirect, please try refreshing'));
    });
  }

  if(p.org.loading || p.org.error || !p.org.getOrganisation.don) {
      return <div />;
  }

  const redirectProps: ButtonProps = {};
  if (loading) {
    redirectProps.loading = true;
    redirectProps.disabled = true;
  }

  return [
    <h3 key="h3-don">{t("Billing")}</h3>,
    <Button key="don-button" {...redirectProps} onClick={redirect}>{t("Manage")}</Button>,
    <p key="don-err">{error}</p>,
  ];
}

const OrganisationDon = getOrganisation(OrganisationDonInner, 'org');
export { OrganisationDon };
