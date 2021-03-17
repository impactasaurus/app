import React, {useState, useEffect} from 'react';
import {Form, Button, ButtonProps} from 'semantic-ui-react';
import {getOrganisation, IGetOrgResult, IUpdateOrgSettings, updateOrgSetting} from 'apollo/modules/organisation';
import {IOrgSettings} from '../../models/organisation';
import { useTranslation } from 'react-i18next';
import './style.less';

interface IProps extends IUpdateOrgSettings {
  org?: IGetOrgResult;
}

const OrganisationSettingsInner = (p: IProps) => {

  const [settings, setSettings] = useState<IOrgSettings>({
    beneficiaryTypeAhead: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>(undefined);
  const {t} = useTranslation();

  useEffect(() => {
    if(p.org.getOrganisation && p.org.getOrganisation.settings) {
      setSettings(p.org.getOrganisation.settings);
    }
  }, [p.org.getOrganisation])

  const save = () => {
    if (saving) {
      return;
    }
    setSaving(true);
    setError(undefined);
    p.updateOrgSetting(settings.beneficiaryTypeAhead)
      .then(() => {
        setSaving(false);
        setError(undefined);
      })
      .catch(() => {
        setSaving(false);
        setError(t('Failed to save, please try refreshing'));
      });
  }

  const benTypeaheadChanged = (_, e) => {
    setSettings({
      ...settings,
      beneficiaryTypeAhead: e.checked,
    });
  }

  const startProps: ButtonProps = {};
  if (saving) {
    startProps.loading = true;
    startProps.disabled = true;
  }

  return (
    <Form loading={p.org.loading} id="organisation-settings">
      <Form.Checkbox checked={settings.beneficiaryTypeAhead} label={t("Show beneficiary suggestions")} onChange={benTypeaheadChanged} />
      <Button {...startProps} onClick={save}>{t("Save")}</Button>
      <p>{error}</p>
    </Form>
  );
}

const OrganisationSettings = updateOrgSetting(getOrganisation(OrganisationSettingsInner, 'org'));
export { OrganisationSettings };
