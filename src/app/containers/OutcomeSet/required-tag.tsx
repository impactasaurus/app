import React, { useEffect, useState } from "react";
import { IRequiredTag } from "models/outcomeSet";
import { Button, Input, InputOnChangeData } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { TagInput } from "components/TagInput/base";
import { TooltipButton } from "components/TooltipButton";

interface IProps {
  id?: string;
  name?: string;
  value: IRequiredTag[];
  onChange: (t: IRequiredTag[]) => void;
}

export const RequiredTagSpecification = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const [rts, setRTs] = useState<IRequiredTag[]>(p.value);

  useEffect(() => {
    p.onChange(rts);
  }, [rts]);

  const add = () => {
    setRTs((rt) => {
      return rt.concat({ label: "", options: [] });
    });
  };

  const remove = (i: number) => {
    return () => {
      setRTs((rt) => {
        return rt.filter((_, idx) => idx !== i);
      });
    };
  };

  const labelOnChange = (index: number) => {
    return (
      _: React.ChangeEvent<HTMLInputElement>,
      data: InputOnChangeData
    ) => {
      setRTs((rts: IRequiredTag[]) => {
        const out = structuredClone(rts);
        out[index].label = data.value;
        return out;
      });
    };
  };

  const tagsOnChange = (index: number): ((t: string[]) => void) => {
    return (t: string[]) => {
      setRTs((rts: IRequiredTag[]) => {
        const out = structuredClone(rts);
        out[index].options = t;
        return out;
      });
    };
  };

  const renderRT = (rt: IRequiredTag, i: number): JSX.Element => {
    return (
      <div
        style={{
          border: "1px solid var(--outline )",
          borderRadius: "5px",
          marginBottom: "1em",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            padding: "0.5em 1em",
            flexGrow: 1,
          }}
        >
          <div style={{ marginBottom: "0.5em" }}>
            <span>{`${t("Label")}:`}</span>
            <Input
              key={`qg-rt-${i}`}
              id={`qg-rt-${btoa(rt.label)}`}
              type="text"
              placeholder={t("Label")}
              value={rt.label}
              onChange={labelOnChange(i)}
            />
          </div>
          <div>
            <span>{`${t("Available tags")}:`}</span>
            <TagInput
              id={`qg-rt-tags-${btoa(rt.label)}`}
              allowNewTags={true}
              tags={rt.options}
              key={`qg-rt-tags-${i}`}
              onChange={tagsOnChange(i)}
            />
          </div>
        </div>

        <div style={{ marginTop: "0.2em" }}>
          <TooltipButton
            buttonProps={{
              icon: "trash",
              basic: true,
              compact: true,
              onClick: remove(i),
            }}
            tooltipContent={t("Delete")}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {rts.map(renderRT)}
      <Button
        className="add-rt"
        onClick={add}
        compact={true}
        size="tiny"
        icon="plus"
        content={t("Add")}
      />
    </div>
  );
};
