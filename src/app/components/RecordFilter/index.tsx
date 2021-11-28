import {
  getBeneficiaries,
  IBeneficiariesResult,
} from "apollo/modules/beneficiaries";
import { getOrgUsers, IGetOrgUsersResult } from "apollo/modules/organisation";
import { allOutcomeSets, IOutcomeResult } from "apollo/modules/outcomeSets";
import { getTags, ITagResult } from "apollo/modules/tags";
import { DropdownCheckbox, IOption } from "components/DropdownCheckbox";
import { useNonInitialEffect } from "helpers/hooks/useNonInitialEffect";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "semantic-ui-react";

interface IProps {
  bens?: IBeneficiariesResult;
  questionnaires?: IOutcomeResult;
  tags?: ITagResult;
  users?: IGetOrgUsersResult;
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
  const [questionnaires, setQuestionnaires] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [clearIdx, setClearIdx] = useState<number>(0);

  useNonInitialEffect(() => {
    p.onChange(bens, questionnaires, users, tags);
  }, [bens, questionnaires, tags, users]);

  const benOptions: IOption[] = (p?.bens?.getBeneficiaries || []).map((b) => ({
    name: b,
    id: b,
  }));
  const questionnaireOptions: IOption[] = (
    p?.questionnaires?.allOutcomeSets || []
  ).map((q) => ({
    name: q.name,
    id: q.id,
  }));
  const tagOptions: IOption[] = (p?.tags?.getTags || []).map((t) => ({
    name: t,
    id: t,
  }));
  const userOptions: IOption[] = (p?.users?.users || []).map((t) => ({
    name: t.name,
    id: t.id,
  }));

  const filterActive =
    bens.length > 0 ||
    questionnaires.length > 0 ||
    tags.length > 0 ||
    users.length > 0;
  const clearFilters = () => {
    setClearIdx(clearIdx + 1);
  };

  return (
    <div style={{ textAlign: "left", marginTop: "-2em" }}>
      <DropdownCheckbox
        dropdownText={t("Beneficiary")}
        onChange={setBens}
        error={!!p.bens?.error}
        loading={!!p.bens?.loading}
        options={benOptions}
        clearTrigger={clearIdx}
      />
      <DropdownCheckbox
        dropdownText={t("Questionnaire")}
        onChange={setQuestionnaires}
        error={!!p.questionnaires?.error}
        loading={!!p.questionnaires?.loading}
        options={questionnaireOptions}
        clearTrigger={clearIdx}
      />
      <DropdownCheckbox
        dropdownText={t("Tag")}
        onChange={setTags}
        error={!!p.tags?.error}
        loading={!!p.tags?.loading}
        options={tagOptions}
        clearTrigger={clearIdx}
      />
      <DropdownCheckbox
        dropdownText={t("Facilitator")}
        onChange={setUsers}
        error={!!p.tags?.error}
        loading={!!p.tags?.loading}
        options={userOptions}
        clearTrigger={clearIdx}
      />
      <span style={{ visibility: filterActive ? "visible" : "hidden" }}>
        <Button basic size="small" onClick={clearFilters}>
          {t("Clear filters")}
        </Button>
      </span>
    </div>
  );
};

const RecordFilterWithBens = getBeneficiaries<IProps>(
  RecordFilterInner,
  "bens"
);
const RecordFilterWithQs = allOutcomeSets<IProps>(
  RecordFilterWithBens,
  "questionnaires"
);
const RecordFilterWithTags = getTags<IProps>(RecordFilterWithQs, "tags");
const RecordFiltersWithUsers = getOrgUsers<IProps>(
  RecordFilterWithTags,
  "users"
);
export const RecordFilter = RecordFiltersWithUsers;
