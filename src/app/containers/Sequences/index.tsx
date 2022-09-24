import React from "react";
import { getSequences, IGetSequences } from "apollo/modules/sequence";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { MinimalPageWrapperHoC } from "components/PageWrapperHoC";
import { SequenceItem } from "./sequence";
import { ISequence } from "models/sequence";
import { GenericQuestionnaireList } from "components/QuestionnaireList";
import { useTranslation } from "react-i18next";

interface IProps {
  data: IGetSequences;
}

const Inner = (p: IProps) => {
  const { t } = useTranslation();
  const newClicked = () => {
    alert("new");
  };

  const renderItem = (i: ISequence) => <SequenceItem sequence={i} key={i.id} />;

  return (
    <GenericQuestionnaireList
      items={p.data.sequences}
      newClicked={newClicked}
      renderItem={renderItem}
      text={{
        newButton: t("New Sequence"),
        title: t("Sequences"),
      }}
    />
  );
};
// t("sequences")
const WithLoader = ApolloLoaderHoC("sequences", (p: IProps) => p.data, Inner);
const WithData = getSequences<IProps>(WithLoader);
// t("Sequences")
export const Sequences = MinimalPageWrapperHoC(
  "Sequences",
  "sequences",
  WithData
);
