import React, { useState } from "react";
import { Input, Form as F, Icon } from "semantic-ui-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "components/FormField";
import { SeqQuestionnaireList } from "./questionnaire-list";
import "./style.less";

interface IProps {
  onSubmit: (s: ISequenceCRUD) => Promise<void>;
  onCancel?: () => void; // defaults to reverting form
  seq: ISequenceCRUD;
  errorText?: string; // overrides the default text shown when errors occur
}

export interface ISequenceCRUD {
  name: string;
  description?: string;
  questionnaires: string[];
  destination?: string;
}

interface ISequenceCRUDInternal {
  name: string;
  description?: string;
  questionnaires: { id: string }[];
  destination?: string;
}

enum ErrorStatus {
  GENERIC_ERROR = 1,
  NAME_ALREADY_USED = 2,
}

const filterNullQuestionnaires = ({ id }: { id: string }) =>
  id && id.length > 0;

export const SequenceForm = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    trigger,
    formState: {
      errors,
      touchedFields: touched,
      isDirty,
      isSubmitting,
      isValid,
    },
  } = useForm<ISequenceCRUDInternal>({
    mode: "onChange",
    defaultValues: {
      ...p.seq,
      questionnaires: p.seq.questionnaires.map((q) => ({ id: q })),
    },
  });
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "questionnaires",
    rules: {
      validate: (arr) => arr.filter(filterNullQuestionnaires).length > 0,
    },
  });

  const [err, setErr] = useState<ErrorStatus>();
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const submitDecorator = (s: ISequenceCRUDInternal): Promise<void> => {
      return p
        .onSubmit({
          ...s,
          questionnaires: s.questionnaires
            .filter(filterNullQuestionnaires)
            .map((q) => q.id),
        })
        .then(() => {
          reset(s);
        });
    };
    setErr(undefined);
    handleSubmit(submitDecorator)(event).catch((err: Error) => {
      let status = ErrorStatus.GENERIC_ERROR;
      if (err?.message?.includes("name already in use")) {
        status = ErrorStatus.NAME_ALREADY_USED;
      }
      setErr(status);
    });
  };

  const qsOnChange = (idx: number) => (id: string) => {
    setValue(`questionnaires.${idx}.id`, id);
    trigger("questionnaires");
  };
  const qsOnRemove = (idx: number) => () => remove(idx);
  const addQuestionnaire = () => append({ id: undefined });
  const onSortEnd = ({ oldIndex, newIndex }): void => move(oldIndex, newIndex);

  const defErrText = `${p.errorText || t("Editing the sequence failed.")} ${t(
    "Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org"
  )}`;
  const errText =
    err == ErrorStatus.NAME_ALREADY_USED
      ? t("Sequence name already in use, please pick another")
      : defErrText;

  return (
    <F className="screen" id="seq-form" onSubmit={onSubmit}>
      <FormField
        error={errors?.name?.message as string}
        touched={touched.name}
        inputID="sq-name"
        required={true}
        label={t("Name")}
      >
        <Input
          id="sq-name"
          type="text"
          placeholder={t("Name")}
          input={register("name", {
            required: t("Please enter a name for the new sequence") as string,
          })}
        />
      </FormField>
      <FormField
        error={errors?.description?.message as string}
        touched={touched.description}
        inputID="sq-description"
        label={t("Description")}
      >
        <Input
          id="sq-description"
          type="text"
          placeholder={t("Description")}
          input={register("description")}
        />
      </FormField>
      <FormField
        error={
          errors?.questionnaires
            ? t("At least one questionnaire is required")
            : undefined
        }
        touched={true}
        inputID="sq-questionnaires"
        required={true}
        label={t("Questionnaires")}
      >
        <SeqQuestionnaireList
          questionnaires={fields.map((v, index) => ({
            id: getValues(`questionnaires.${index}.id`),
            key: v.id,
          }))}
          onChange={qsOnChange}
          onRemove={qsOnRemove}
          addQuestionnaire={addQuestionnaire}
          useDragHandle={true}
          onSortEnd={onSortEnd}
        />
      </FormField>
      <FormField
        error={errors?.destination?.message as string}
        touched={touched.destination}
        inputID="sq-destination"
        label={t("Destination")}
        description={t(
          "After completing the above questionnaires, beneficiaries can optionally be sent to another website"
        )}
      >
        <Input
          id="sq-destination"
          type="text"
          icon={"linkify"}
          iconPosition={"left"}
          // eslint-disable-next-line i18next/no-literal-string
          placeholder="https://example.com"
          input={register("destination", {
            validate: (v): string | undefined => {
              if (!v) {
                return undefined;
              }
              try {
                new URL(v);
                return undefined;
              } catch (_) {
                return t("Destination should be a valid web address");
              }
            },
          })}
        />
      </FormField>

      <F.Group>
        <F.Button
          type="reset"
          disabled={p.onCancel ? false : !isDirty}
          onClick={() => (p.onCancel ? p.onCancel() : reset())}
        >
          {t("Cancel")}
        </F.Button>
        <F.Button
          type="submit"
          primary={true}
          disabled={!isDirty || !isValid || isSubmitting}
          loading={isSubmitting}
        >
          {t("Save")}
        </F.Button>
      </F.Group>
      {err && (
        <div className="submit-error">
          <Icon name="exclamation" />
          {errText}
        </div>
      )}
    </F>
  );
};
