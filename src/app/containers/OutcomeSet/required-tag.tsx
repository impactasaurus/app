import React, { useEffect, useState } from "react";
import { IRequiredTag } from "models/outcomeSet";
import { Button, Icon, Input, InputOnChangeData } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { TagInput } from "components/TagInput/base";
import { TooltipButton } from "components/TooltipButton";
import cx from "classnames";
import { Hint } from "components/Hint";
import structuredClone from "core-js-pure/actual/structured-clone";

interface IProps {
  id?: string;
  name?: string;
  value: IRequiredTag[];
  onChange: (t: IRequiredTag[]) => void;
}

export const ValidateRequiredTags = (
  rts: IRequiredTag[],
  t: (s: string) => string,
  labelErrors = true,
  optionErrors = true
): string[] | undefined[] => {
  return rts.map((rt) => {
    if (labelErrors && rt.label.length === 0) {
      return t("Label must be provided");
    }
    if (labelErrors && rts.filter((v) => v.label == rt.label).length !== 1) {
      return t("This label has already been used");
    }
    if (
      optionErrors &&
      (!Array.isArray(rt.options) || rt.options.length === 0)
    ) {
      return t("Options must be provided");
    }
    return undefined;
  });
};

export const RequiredTagSpecification = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const [rts, setRTs] = useState<IRequiredTag[]>(p.value);

  useEffect(() => {
    setRTs(p.value);
  }, [p.value]);

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
    const labelError = ValidateRequiredTags(rts, t, true, false)[i];
    const tagError = ValidateRequiredTags(rts, t, false, true)[i];
    return (
      <div
        style={{
          border: "1px solid var(--outline )",
          borderRadius: "5px",
          marginBottom: "1em",
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
          <div
            style={{ marginBottom: "0.5em", textAlign: "left" }}
            className={cx({ "field error": labelError })}
          >
            <span>
              <Hint text={t("Used as a field in the new record form")} />
              {`${t("Label")}:`}
            </span>
            <Input
              key={`qg-rt-${i}`}
              id={`qg-rt-${btoa(rt.label)}`}
              type="text"
              placeholder={t("Label")}
              value={rt.label}
              onChange={labelOnChange(i)}
            />
            {labelError && (
              <span className="error validation">
                <Icon name="exclamation" />
                {labelError}
              </span>
            )}
          </div>
          <div
            style={{ textAlign: "left" }}
            className={cx({ "field error": tagError })}
          >
            <span style={{ textAlign: "left" }}>
              <Hint text={t("Which tags can the facilitator select from")} />
              {`${t("Available tags")}:`}
            </span>
            <TagInput
              id={`qg-rt-tags-${btoa(rt.label)}`}
              allowNewTags={true}
              tags={rt.options}
              key={`qg-rt-tags-${i}`}
              onChange={tagsOnChange(i)}
            />
            {tagError && (
              <span className="error validation">
                <Icon name="exclamation" />
                {tagError}
              </span>
            )}
          </div>
        </div>

        <div style={{ marginTop: "0.2em" }}>
          <TooltipButton
            buttonProps={{
              icon: "trash",
              basic: true,
              compact: true,
              onClick: remove(i),
              type: "button",
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
        type="button"
      />
    </div>
  );
};
