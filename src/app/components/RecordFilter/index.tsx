import {
  getBeneficiaries,
  IBeneficiariesResult,
} from "apollo/modules/beneficiaries";
import { DropdownCheckbox, IOption } from "components/DropdownCheckbox";
import { useNonInitialEffect } from "helpers/hooks/useNonInitialEffect";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  bens?: IBeneficiariesResult;
  onChange: (
    bens: string[],
    questionnaires: string[],
    users: string[],
    tags: string[]
  ) => void;
}

const RecordFilterInner = (p: IProps) => {
  const { t } = useTranslation();
  const [bens, setBens] = useState<string[]>([]);

  useNonInitialEffect(() => {
    p.onChange(bens, [], [], []);
  }, [bens]);

  const options: IOption[] = (p?.bens?.getBeneficiaries || []).map((b) => ({
    name: b,
    id: b,
  }));

  return (
    <div>
      <DropdownCheckbox
        dropdownText={t("Beneficiary")}
        onChange={setBens}
        error={!!p.bens?.error}
        loading={!!p.bens?.loading}
        options={options}
      />
    </div>
  );
};

const RecordFilterWithBens = getBeneficiaries<IProps>(
  RecordFilterInner,
  "bens"
);
export const RecordFilter = RecordFilterWithBens;
