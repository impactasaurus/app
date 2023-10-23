import React, { useEffect, useState } from "react";
import { IOutcomeResult, getOutcomeSet } from "apollo/modules/outcomeSets";
import { IRequiredTag } from "models/outcomeSet";
import { FormField } from "components/FormField";
import { Select } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

interface IExtProps {
  id?: string;
  questionnaireID: string;
  onChange: (tags: string[]) => void;
  inputID?: string;
}

interface IProps extends IExtProps {
  data: IOutcomeResult;
}

const RTFormField = (p: {
  baseID: string;
  tag: IRequiredTag;
  onChange: (tag: string) => void;
  value?: string;
}): JSX.Element => {
  const inputID = p.baseID + "--" + atob(p.tag.label);
  const [selected, setSelected] = useState(p.value);
  useEffect(() => {
    p.onChange(selected);
  }, [selected]);
  const [touched, setTouched] = useState(false);
  const { t } = useTranslation();
  const wrapper = (child: JSX.Element): JSX.Element => {
    return (
      <FormField
        inputID={inputID}
        label={p.tag.label}
        touched={touched}
        error={selected ? undefined : t("Value is required")}
        required={true}
      >
        {child}
      </FormField>
    );
  };

  const noOptions = !Array.isArray(p.tag.options) || p.tag.options.length === 0;
  if (noOptions) {
    return <div />;
  }

  const onSelect = (_, data) => {
    const selectedItem = (p.tag.options || []).find((i) => i === data.value);
    setSelected(selectedItem);
  };

  return wrapper(
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
  );
};

const Inner = (p: IProps): JSX.Element => {
  const q = p?.data?.getOutcomeSet;
  if (!q) {
    return <span />;
  }
  const [tags, setTags] = useState<Record<string, string>>({});
  const key = (label: string) => `${q.id}::${atob(label)}`;

  useEffect(() => {
    const values = Object.keys(tags)
      .filter((k) => k.startsWith(q.id))
      .map((k) => tags[k]);
    p.onChange(values);
  }, [tags, q]);

  const onChange = (rt: IRequiredTag): ((tag: string) => void) => {
    return (tag: string) => {
      setTags((tags) => ({
        ...tags,
        [key(rt.label)]: tag,
      }));
    };
  };

  return (
    <div id={p.id}>
      {(q.requiredTags || []).map((rt) => (
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

export const RequiredTagInput = getOutcomeSet<IExtProps>(
  (p: IProps) => p.questionnaireID
)(Inner);
