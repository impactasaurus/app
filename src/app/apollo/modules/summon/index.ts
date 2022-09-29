import { gql, graphql } from "react-apollo";
import { mutationResultExtractor } from "helpers/apollo";
import { defaultRemoteMeetingLimit } from "models/assessment";

export function newMeetingFromSummon<T>(component) {
  return graphql<any, T>(
    gql`
      mutation ($beneficiaryID: String!, $summonID: String!) {
        newMeetingFromSummon: NewMeetingFromSummon(
          beneficiaryID: $beneficiaryID
          summonID: $summonID
        )
      }
    `,
    {
      props: ({ mutate }) => ({
        newMeetingFromSummon: (
          summonID: string,
          beneficiaryID: string
        ): Promise<string> =>
          mutate({
            variables: {
              summonID,
              beneficiaryID,
            },
          }).then(mutationResultExtractor<string>("newMeetingFromSummon")),
      }),
    }
  )(component);
}

export interface ISummonAcceptanceMutation {
  newMeetingFromSummon: (
    summonID: string,
    beneficiaryID: string
  ) => Promise<string>;
}

export function generateSummon<T>(component) {
  return graphql<any, T>(
    gql`
  mutation($outcomeSetID: String!) {
    generateSummon: NewMeetingSummon(outcomeSetID:$outcomeSetID, daysToComplete: ${defaultRemoteMeetingLimit})
  }
`,
    {
      props: ({ mutate }) => ({
        generateSummon: (outcomeSetID: string): Promise<string> =>
          mutate({
            variables: {
              outcomeSetID,
            },
          }).then(mutationResultExtractor<string>("generateSummon")),
      }),
    }
  )(component);
}

export interface IGenerateSummon {
  generateSummon: (outcomeSetID: string) => Promise<string>;
}

export function generateSequenceSummon<T>(component) {
  return graphql<any, T>(
    gql`
  mutation($sequenceID: String!) {
    summon: NewSequenceSummon(sequenceID:$sequenceID, daysToComplete: ${defaultRemoteMeetingLimit})
  }
`,
    {
      props: ({ mutate }) => ({
        generateSequenceSummon: (sequenceID: string): Promise<string> =>
          mutate({
            variables: {
              sequenceID,
            },
          }).then(mutationResultExtractor<string>("summon")),
      }),
    }
  )(component);
}

export interface IGenerateSequenceSummon {
  generateSequenceSummon: (sequenceID: string) => Promise<string>;
}
