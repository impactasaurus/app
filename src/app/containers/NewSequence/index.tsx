import React from "react";
import { INewSequence, newSequence } from "apollo/modules/sequence";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { ISequenceCRUD, SequenceForm } from "components/SequenceForm";
import { useTranslation } from "react-i18next";
import { useNavigator } from "redux/modules/url";
import { QuestionnaireRequired } from "components/QuestionnaireRequired";

const Inner = (p: INewSequence): JSX.Element => {
  const setURL = useNavigator();
  const { t } = useTranslation();

  const onCancel = () => {
    setURL("/sequences");
  };

  const onSubmit = (q: ISequenceCRUD): Promise<void> => {
    return p.newSequence(q).then(() => setURL(`/sequences`));
  };

  return (
    <SequenceForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      seq={{ name: "", questionnaires: [undefined] }}
      errorText={t("Creating the sequence failed.")}
    />
  );
};

const WithData = newSequence<INewSequence>(Inner);
const WithBlocker = QuestionnaireRequired(WithData);
export const NewSequence = PageWrapperHoC(
  "New Sequence",
  "new-sequence",
  WithBlocker
);
