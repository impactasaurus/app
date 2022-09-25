import { allOutcomeSets, IOutcomeResult } from "apollo/modules/outcomeSets";
import { getSequences, IGetSequences } from "apollo/modules/sequence";
import React from "react";
import { ApolloError } from "react-apollo";

export enum QuestionnairishType {
  QUESTIONNAIRE,
  SEQUENCE,
}

export interface IQuestionnairish {
  id: string;
  name: string;
  type: QuestionnairishType;
}

export interface IQuestionnairishResult {
  items?: IQuestionnairish[];
  error?: ApolloError;
  loading: boolean;
}

export interface IQuestionnairishProps {
  qAndS: IQuestionnairishResult;
}

interface IInnerProps {
  qq: IOutcomeResult;
  seq: IGetSequences;
}

function combine(
  p: IInnerProps,
  incS?: boolean,
  incQ?: boolean
): IQuestionnairishResult {
  const out: IQuestionnairishResult = {
    loading: p.qq.loading || p.seq.loading,
    error: p.qq.error || p.seq.error,
  };
  // don't fill out items until both queries are ready
  if (!out.loading && !out.error) {
    out.items = [];
    if (incQ && Array.isArray(p.qq.allOutcomeSets)) {
      out.items = out.items.concat(
        p.qq.allOutcomeSets.map((q) => ({
          ...q,
          type: QuestionnairishType.QUESTIONNAIRE,
        }))
      );
    }
    if (incS && Array.isArray(p.seq.sequences)) {
      out.items = out.items.concat(
        p.seq.sequences.map((s) => ({
          ...s,
          type: QuestionnairishType.SEQUENCE,
        }))
      );
    }
    out.items.sort((a, b) => a.name.localeCompare(b.name));
  }
  return out;
}

export const QuestionnairesAndSequencesHoC = <P extends IQuestionnairishProps>(
  WrappedComponent: React.ComponentType<P>,
  includeSequences: (p: P) => boolean = () => true,
  includeQuestionnaires: (p: P) => boolean = () => true
): React.ComponentType<Omit<P, "qAndS">> => {
  const Inner = (p: P & IInnerProps) => {
    return (
      <WrappedComponent
        {...p}
        qAndS={combine(p, includeSequences(p), includeQuestionnaires(p))}
      />
    );
  };
  const WithData = allOutcomeSets<Omit<P, "qAndS">>(
    getSequences(Inner, "seq"),
    "qq"
  );
  return WithData;
};
