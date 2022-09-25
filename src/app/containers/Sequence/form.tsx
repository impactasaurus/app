import React, { useState } from "react";
import { Input, Form as F, Icon } from "semantic-ui-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormField } from "components/FormField";
import { SeqQuestionnaireList } from "./questionnaire-list";
import "./style.less";

interface IProps {
  onSubmit: (s: ISequenceCRUD) => Promise<void>;
  seq: ISequenceCRUD;
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

export const Form = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    formState: {
      errors,
      touchedFields: touched,
      isDirty,
      isSubmitting,
      isValid,
    },
  } = useForm<ISequenceCRUDInternal>({
    defaultValues: {
      ...p.seq,
      destination: p.seq.destination
        ? p.seq.destination.replace(/(^\w+:|^)\/\//, "")
        : undefined,
      questionnaires: p.seq.questionnaires.map((q) => ({ id: q })),
    },
  });
  const { fields, append, update, move, remove } = useFieldArray({
    control,
    name: "questionnaires",
    rules: {
      required: t("At least one questionnaire is required") as string,
    },
  });

  const [err, setErr] = useState<boolean>(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const submitDecorator = (s: ISequenceCRUDInternal): Promise<void> => {
      return p.onSubmit({
        ...s,
        destination: s.destination
          ? `https://${s.destination}`.trim()
          : undefined,
        questionnaires: s.questionnaires.map((q) => q.id),
      });
    };
    handleSubmit(submitDecorator)(e).catch(() => {
      setErr(true);
    });
  };

  const qsOnChange = (idx: number) => (id: string) => update(idx, { id: id });
  const qsOnRemove = (idx: number) => () => remove(idx);
  const addQuestionnaire = () => append({ id: undefined });
  const onSortEnd = ({ oldIndex, newIndex }): void => move(oldIndex, newIndex);

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
          input={register("name", { required: true })}
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
        error={errors?.questionnaires?.root?.message as string}
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
          // eslint-disable-next-line i18next/no-literal-string
          label="https://"
          // eslint-disable-next-line i18next/no-literal-string
          placeholder="example.com"
          input={register("destination", {
            validate: (v): string | undefined => {
              if (!v) {
                return undefined;
              }
              if (v.indexOf("://") != -1) {
                return t(
                  "The protocol (e.g. 'https://') does not need to be included in the text provided. For security, we only support 'https://'"
                );
              }
              try {
                new URL("https://" + v);
                return undefined;
              } catch (_) {
                return t("Destination should be a valid web address");
              }
            },
          })}
        />
      </FormField>

      <F.Group>
        <F.Button type="reset" disabled={!isDirty} onClick={() => reset()}>
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
          {t("Editing the questionnaire failed.")}{" "}
          {t(
            "Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org"
          )}
        </div>
      )}
    </F>
  );
};
