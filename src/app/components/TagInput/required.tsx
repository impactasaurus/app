import React, { useEffect, useState } from "react";
import { IOutcomeResult, getOutcomeSet } from "apollo/modules/outcomeSets";
import { IRequiredTag } from "models/outcomeSet";
import { FormField } from "components/FormField";
import { Select } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { QuestionnairishType } from "components/QuestionnairesAndSequencesHoC";
import { IGetSequence, getSequence } from "apollo/modules/sequence";

interface IProps extends IExtProps {
  requiredTags: IRequiredTag[];
}

const RTFormField = (p: {
  baseID: string;
  tag: IRequiredTag;
  onChange: (tag: string) => void;
  value?: string;
}): JSX.Element => {
  const noOptions = !Array.isArray(p.tag.options) || p.tag.options.length === 0;
  if (noOptions) {
    return <div />;
  }

  const [selected, setSelected] = useState(p.value);
  useEffect(() => {
    p.onChange(selected);
  }, [selected]);

  const inputID = p.baseID + "--" + btoa(p.tag.label);
  const [touched, setTouched] = useState(false);
  const { t } = useTranslation();

  const onSelect = (_, data) => {
    setSelected(data.value);
  };

  return (
    <FormField
      inputID={inputID}
      label={p.tag.label}
      touched={touched}
      error={selected ? undefined : t("Value is required")}
      required={true}
    >
      <Select
        id={inputID}
        className="required-tag-selector"
        value={selected}
        onChange={onSelect}
        options={p.tag.options.map((p) => ({
          value: p,
          text: p,
        }))}
        onBlur={() => setTouched(true)}
      />
    </FormField>
  );
};

const RTInput = (p: IProps): JSX.Element => {
  const [tags, setTags] = useState<Record<string, string>>({});
  const key = (label: string) => `${p.qishID}::${btoa(label)}`;

  useEffect(() => {
    const values = Object.keys(tags)
      .filter((k) => k.startsWith(p.qishID))
      .map((k) => tags[k]);
    p.onChange(values);
  }, [tags, p.qishID]);

  const onChange = (rt: IRequiredTag): ((tag: string) => void) => {
    return (tag: string) => {
      const cachedKey = key(rt.label);
      setTags((tags) => ({
        ...tags,
        [cachedKey]: tag,
      }));
    };
  };

  return (
    <div id={p.id}>
      {(p.requiredTags || []).map((rt) => (
        <RTFormField
          baseID={p.inputID}
          key={key(rt.label)}
          tag={rt}
          value={tags[key(rt.label)]}
          onChange={onChange(rt)}
        />
      ))}
    </div>
  );
};

interface IExtProps {
  id?: string;
  qishID: string;
  qishType: QuestionnairishType;
  onChange: (tags: string[]) => void;
  inputID?: string;
}

const RTIQuestionnaireInner = (
  p: IExtProps & { data: IOutcomeResult }
): JSX.Element => {
  const loaded = p?.data?.getOutcomeSet?.id === p.qishID;
  const reqTags = loaded ? p?.data?.getOutcomeSet?.requiredTags : undefined;
  return <RTInput {...p} requiredTags={reqTags} />;
};
const RTIQuestionnaire = getOutcomeSet((p: IExtProps) => p.qishID)(
  RTIQuestionnaireInner
);

const RTISequenceInner = (
  p: IExtProps & { data: IGetSequence }
): JSX.Element => {
  const loaded = p?.data?.sequence?.id === p.qishID;
  const reqTags = loaded ? p?.data?.sequence?.requiredTags : undefined;
  return <RTInput {...p} requiredTags={reqTags} />;
};
const RTISequence = getSequence((p: IExtProps) => p.qishID)(RTISequenceInner);

export const RequiredTagInput = (p: IExtProps): JSX.Element =>
  p.qishType === QuestionnairishType.QUESTIONNAIRE ? (
    <RTIQuestionnaire {...p} />
  ) : (
    <RTISequence {...p} />
  );
