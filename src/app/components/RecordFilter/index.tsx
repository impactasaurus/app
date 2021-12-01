import React, { useRef, useState } from "react";
import { useNonInitialEffect } from "helpers/hooks/useNonInitialEffect";
import { useTranslation } from "react-i18next";
import { Button } from "semantic-ui-react";
import ReactGA from "react-ga";
import {
  BenFilter,
  QuestionnaireFilter,
  TagFilter,
  UserFilter,
} from "./filter";
import { LazyFilter } from "./lazyFilter";

interface IProps {
  onChange: (
    bens: string[],
    questionnaires: string[],
    users: string[],
    tags: string[]
  ) => void;
}

export const RecordFilter = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const [bens, setBens] = useState<string[]>([]);
  const [questionnaires, setQuestionnaires] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [clearIdx, setClearIdx] = useState<number>(0);
  const firstFilter = useRef<boolean>(false);

  useNonInitialEffect(() => {
    p.onChange(bens, questionnaires, users, tags);
    if (!firstFilter.current) {
      firstFilter.current = true;
      ReactGA.event({
        category: "activity-feed",
        action: "filter",
      });
    }
  }, [bens, questionnaires, tags, users]);

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
      <LazyFilter dropDownText={t("Beneficiary")}>
        <BenFilter
          clearTrigger={clearIdx}
          dropdownText={t("Beneficiary")}
          onChange={setBens}
          autoOpen={true}
        />
      </LazyFilter>
      <LazyFilter dropDownText={t("Questionnaire")}>
        <QuestionnaireFilter
          clearTrigger={clearIdx}
          dropdownText={t("Questionnaire")}
          onChange={setQuestionnaires}
          autoOpen={true}
        />
      </LazyFilter>
      <LazyFilter dropDownText={t("Tag")}>
        <TagFilter
          dropdownText={t("Tag")}
          onChange={setTags}
          clearTrigger={clearIdx}
          autoOpen={true}
        />
      </LazyFilter>
      <LazyFilter dropDownText={t("Facilitator")}>
        <UserFilter
          clearTrigger={clearIdx}
          dropdownText={t("Facilitator")}
          onChange={setUsers}
          autoOpen={true}
        />
      </LazyFilter>
      <span style={{ visibility: filterActive ? "visible" : "hidden" }}>
        <Button basic size="small" onClick={clearFilters}>
          {t("Clear filters")}
        </Button>
      </span>
    </div>
  );
};
