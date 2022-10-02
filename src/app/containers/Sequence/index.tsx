import React from "react";
import Helmet from "react-helmet";
import {
  editSequence,
  getSequence,
  IEditSequence,
  IGetSequence,
} from "apollo/modules/sequence";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { PageWrapper } from "components/PageWrapperHoC";
import { SequenceForm, ISequenceCRUD } from "../../components/SequenceForm";

interface IProps {
  data: IGetSequence;
  match: {
    params: {
      id: string;
    };
  };
}

const SequenceInner = (p: IProps & IEditSequence): JSX.Element => {
  const seq = p.data.sequence;
  const onSubmit = (s: ISequenceCRUD): Promise<void> => {
    return p.editSequence(seq.id, s).then();
  };
  return (
    <PageWrapper>
      <Helmet>
        <title>{seq.name}</title>
      </Helmet>
      <h1>{seq.name}</h1>
      <SequenceForm
        seq={{
          ...seq,
          questionnaires: seq.questionnaires.map((q) => q.id),
        }}
        onSubmit={onSubmit}
      />
    </PageWrapper>
  );
};

// t("sequence")
const SequenceWithLoader = ApolloLoaderHoC<IProps>(
  "sequence",
  (p) => p.data,
  SequenceInner,
  { wrapInGrid: true }
);
export const Sequence = getSequence<IProps>((props) => props.match.params.id)(
  editSequence(SequenceWithLoader)
);
