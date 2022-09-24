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

const mWidth = "600px";

const Inner = (p: IProps) => {
  const { t } = useTranslation();
  const newClicked = () => {
    alert("new");
  };

  const renderItem = (i: ISequence) => <SequenceItem sequence={i} key={i.id} />;

  return (
    <GenericQuestionnaireList
      className="sequences"
      items={p.data.sequences}
      newClicked={newClicked}
      renderItem={renderItem}
      text={{
        newButton: t("New Sequence"),
        title: t("Sequences"),
      }}
      emptyList={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p style={{ maxWidth: mWidth }}>
            {t(
              "Sequences make it easy to ask a beneficiary to complete more than one questionnaire."
            )}
          </p>
          <p style={{ maxWidth: mWidth }}>
            {t(
              "Simply create a sequence and select which questionnaires you want completed. You can then generate remote links for the sequence, which will take the beneficiary through all of the specified questionnaires."
            )}
          </p>
          <p style={{ maxWidth: mWidth }}>
            {t(
              "When the questionnaires have been answered, you can choose to send the beneficiary to another website. This allows you to use Impactasaurus alongside general purpose questionnaire systems."
            )}
          </p>
        </div>
      }
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
