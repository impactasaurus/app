import { ChildProps, gql, graphql, QueryProps } from "react-apollo";
import {
  IMeeting,
  fragment,
  fragmentWithOutcomeSetAndAggregates,
  fragmentWithOutcomeSet,
} from "models/meeting";
import {
  Extractor,
  IDExtractor,
  mutationResultExtractor,
} from "helpers/apollo";
import { invalidateFields, ROOT } from "apollo-cache-invalidation";
import { IAssessmentConfig } from "models/assessment";
import { ComponentDecorator } from "react-apollo/types";

// see impactasaurus/app#55, not an ideal fix
// forces refetch of meeting related queries by deleting root query pointers for `meeting` and `meetings` queries
export function clearCacheOfAllMeetings() {
  return invalidateFields(() => [
    [ROOT, /^meeting.*/],
    [ROOT, /recentMeetings/],
  ]);
}

export const getMeeting = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(
    gql`
      query ($id: String!) {
        getMeeting: meeting(id: $id) {
          ...meetingWithOutcomeSetAndAggregates
        }
      }
      ${fragmentWithOutcomeSetAndAggregates}
    `,
    {
      options: (props: T) => {
        return {
          variables: {
            id: idExtractor(props),
          },
        };
      },
    }
  );
};

export const getMeetingsGQL = gql`
  query ($beneficiaryID: String!) {
    getMeetings: meetings(beneficiary: $beneficiaryID) {
      ...meetingWithOutcomeSetAndAggregates
    }
  }
  ${fragmentWithOutcomeSetAndAggregates}
`;

export const getMeetings = <T>(idExtractor: IDExtractor<T>, name?: string) => {
  return graphql<any, T>(getMeetingsGQL, {
    options: (props: T) => {
      return {
        variables: {
          beneficiaryID: idExtractor(props),
        },
      };
    },
    name: name ? name : "data",
  });
};

export interface IGetRecentMeetings
  extends QueryProps,
    IGetRecentMeetingsData {}

interface IGetRecentMeetingsData {
  getRecentMeetings: {
    isMore: boolean;
    page: number;
    meetings: IMeeting[];
  };
}

export const getRecentMeetingsGQL = gql`
  query (
    $page: Int!
    $limit: Int!
    $bens: [String]
    $questionnaires: [String]
    $users: [String]
    $tags: [String]
  ) {
    getRecentMeetings: recentMeetings(
      page: $page
      limit: $limit
      beneficiaries: $bens
      users: $users
      tags: $tags
      questionnaires: $questionnaires
    ) {
      isMore
      page
      meetings {
        ...meetingWithOutcomeSet
      }
    }
  }
  ${fragmentWithOutcomeSet}
`;

interface IGetRecentMeetingsOptions<T> {
  pageExtractor?: Extractor<T, number>;
  name?: string;
  bens?: Extractor<T, string[]>;
  questionnaires?: Extractor<T, string[]>;
  users?: Extractor<T, string[]>;
  tags?: Extractor<T, string[]>;
  limit?: number;
}

export const getRecentMeetings = <T>({
  pageExtractor = () => 0,
  name = "data",
  bens = () => undefined,
  questionnaires = () => undefined,
  users = () => undefined,
  tags = () => undefined,
  limit = 12,
}: IGetRecentMeetingsOptions<T>): ComponentDecorator<
  T,
  ChildProps<T, IGetRecentMeetingsData>
> => {
  return graphql<IGetRecentMeetingsData, T>(getRecentMeetingsGQL, {
    options: (props: T) => {
      return {
        variables: {
          limit: limit,
          page: pageExtractor(props),
          bens: bens(props),
          questionnaires: questionnaires(props),
          users: users(props),
          tags: tags(props),
        },
        notifyOnNetworkStatusChange: true,
      };
    },
    name: name,
  });
};

export const getMoreRecentMeetings = (page: number): any => ({
  variables: {
    page,
  },
  updateQuery: (
    prev: IGetRecentMeetingsData,
    { fetchMoreResult }: { fetchMoreResult: IGetRecentMeetingsData }
  ): IGetRecentMeetingsData => {
    if (!fetchMoreResult) {
      return prev;
    }
    const meetings = [].concat(prev.getRecentMeetings.meetings);
    fetchMoreResult.getRecentMeetings.meetings.forEach((nm) => {
      // having issues where updateQuery is called twice, put in dup logic to guard against it
      const dup = meetings.find((m) => m.id === nm.id);
      if (dup === undefined) {
        meetings.push(nm);
      }
    });
    return {
      getRecentMeetings: {
        ...fetchMoreResult.getRecentMeetings,
        meetings,
      },
    };
  },
});

export const getAllMeetingsGQL = gql`
  query getAllMeetings($beneficiaryID: String!) {
    getIncompleteMeetings: incompleteMeetings(beneficiary: $beneficiaryID) {
      ...meetingWithOutcomeSetAndAggregates
    }
    getMeetings: meetings(beneficiary: $beneficiaryID) {
      ...meetingWithOutcomeSetAndAggregates
    }
  }
  ${fragmentWithOutcomeSetAndAggregates}
`;

export const getAllMeetings = <T>(
  idExtractor: IDExtractor<T>,
  name?: string
) => {
  return graphql<any, T>(getAllMeetingsGQL, {
    options: (props: T) => {
      return {
        variables: {
          beneficiaryID: idExtractor(props),
        },
      };
    },
    name: name ? name : "data",
  });
};

export const exportMeetings = <T>(
  idExtractor: IDExtractor<T>,
  start?: IDExtractor<T>,
  end?: IDExtractor<T>,
  tags?: Extractor<T, string[]>,
  orTags?: Extractor<T, boolean>
) => {
  return graphql<any, T>(
    gql`
      query (
        $qid: String!
        $start: String
        $end: String
        $tags: [String]
        $orTags: Boolean
      ) {
        exportMeetings: exportMeetings(
          qID: $qid
          start: $start
          end: $end
          tags: $tags
          orTags: $orTags
        )
      }
    `,
    {
      options: (props: T) => {
        return {
          variables: {
            qid: idExtractor(props),
            start: start ? start(props) : undefined,
            end: end ? end(props) : undefined,
            tags: tags ? tags(props) : undefined,
            orTags: orTags ? orTags(props) : false,
          },
          fetchPolicy: "network-only",
          notifyOnNetworkStatusChange: true,
        };
      },
    }
  );
};

export const exportBenMeetings = <T>(
  idExtractor: IDExtractor<T>,
  benExtractor: IDExtractor<T>
) => {
  return graphql<any, T>(
    gql`
      query ($qid: String!, $ben: String!) {
        exportBenMeetings: exportBenMeetings(qID: $qid, beneficiary: $ben)
      }
    `,
    {
      options: (props: T) => {
        return {
          variables: {
            qid: idExtractor(props),
            ben: benExtractor(props),
          },
          fetchPolicy: "network-only",
          notifyOnNetworkStatusChange: true,
        };
      },
    }
  );
};

export interface IExportBenMeetingsResult extends QueryProps {
  exportBenMeetings?: string;
}

export function newMeeting<T>(component) {
  return graphql<any, T>(
    gql`
      mutation (
        $beneficiaryID: String!
        $outcomeSetID: String!
        $conducted: String
        $tags: [String]
      ) {
        newMeeting: AddMeeting(
          beneficiaryID: $beneficiaryID
          outcomeSetID: $outcomeSetID
          conducted: $conducted
          tags: $tags
        ) {
          ...defaultMeeting
        }
      }
      ${fragment}
    `,
    {
      props: ({ mutate }) => ({
        newMeeting: (config: IAssessmentConfig): Promise<IMeeting> =>
          mutate({
            variables: {
              beneficiaryID: config.beneficiaryID,
              outcomeSetID: config.qishID,
              conducted: config?.date?.toISOString(),
              tags: config.tags || [],
            },
            refetchQueries: [
              {
                query: getMeetingsGQL,
                variables: {
                  beneficiaryID: config.beneficiaryID,
                },
              },
              {
                query: getAllMeetingsGQL,
                variables: {
                  beneficiaryID: config.beneficiaryID,
                },
              },
            ],
          }).then(mutationResultExtractor<IMeeting>("newMeeting")),
      }),
    }
  )(component);
}

export function newRemoteMeeting<T>(component) {
  return graphql<any, T>(
    gql`
      mutation (
        $beneficiaryID: String!
        $outcomeSetID: String!
        $daysToComplete: Int!
        $tags: [String]
      ) {
        newRemoteMeeting: AddRemoteMeeting(
          beneficiaryID: $beneficiaryID
          outcomeSetID: $outcomeSetID
          daysToComplete: $daysToComplete
          tags: $tags
        ) {
          JTI
        }
      }
    `,
    {
      props: ({ mutate }) => ({
        newRemoteMeeting: (
          config: IAssessmentConfig,
          daysToComplete: number
        ): Promise<string> =>
          mutate({
            variables: {
              beneficiaryID: config.beneficiaryID,
              outcomeSetID: config.qishID,
              daysToComplete: Math.ceil(daysToComplete),
              tags: config.tags || [],
            },
            refetchQueries: [
              {
                query: getMeetingsGQL,
                variables: {
                  beneficiaryID: config.beneficiaryID,
                },
              },
              {
                query: getAllMeetingsGQL,
                variables: {
                  beneficiaryID: config.beneficiaryID,
                },
              },
            ],
          })
            .then(
              mutationResultExtractor<{
                JTI: string;
              }>("newRemoteMeeting")
            )
            .then((x) => x.JTI),
      }),
    }
  )(component);
}

export function addLikertAnswer<T>(component) {
  return graphql<any, T>(
    gql`
      mutation (
        $meetingID: String!
        $questionID: String!
        $value: Int!
        $notes: String
      ) {
        addLikertAnswer: AddLikertAnswer(
          meetingID: $meetingID
          questionID: $questionID
          value: $value
          allowOverwrite: true
          notes: $notes
        ) {
          ...meetingWithOutcomeSetAndAggregates
        }
      }
      ${fragmentWithOutcomeSetAndAggregates}
    `,
    {
      props: ({ mutate }) => ({
        addLikertAnswer: (
          meetingID: string,
          questionID: string,
          value: number,
          notes?: string
        ): Promise<IMeeting> =>
          mutate({
            variables: {
              meetingID,
              questionID,
              value,
              notes,
            },
          }).then(mutationResultExtractor<IMeeting>("addLikertAnswer")),
      }),
    }
  )(component);
}

export function completeMeeting<T>(component) {
  return graphql<any, T>(
    gql`
      mutation ($meetingID: String!) {
        completeMeeting: CompleteMeeting(meetingID: $meetingID) {
          ...meetingWithOutcomeSetAndAggregates
        }
      }
      ${fragmentWithOutcomeSetAndAggregates}
    `,
    {
      props: ({ mutate }) => ({
        completeMeeting: (
          meetingID: string,
          beneficiaryID: string
        ): Promise<IMeeting> =>
          mutate({
            variables: {
              meetingID,
            },
            refetchQueries: [
              {
                query: getMeetingsGQL,
                variables: { beneficiaryID },
              },
              {
                query: getAllMeetingsGQL,
                variables: { beneficiaryID },
              },
              {
                query: getRecentMeetingsGQL,
                variables: { page: 0, limit: 12 },
              },
            ],
          }).then(mutationResultExtractor<IMeeting>("completeMeeting")),
      }),
    }
  )(component);
}

export interface ISetMeetingNotes {
  setMeetingNotes?: (meetingID: string, notes?: string) => Promise<IMeeting>;
}
export function setMeetingNotes<T>(component) {
  return graphql<any, T>(
    gql`
      mutation ($meetingID: String!, $notes: String) {
        setNotes: SetMeetingNotes(meetingID: $meetingID, notes: $notes) {
          ...meetingWithOutcomeSetAndAggregates
        }
      }
      ${fragmentWithOutcomeSetAndAggregates}
    `,
    {
      props: ({ mutate }) => ({
        setMeetingNotes: (
          meetingID: string,
          notes?: string
        ): Promise<IMeeting> =>
          mutate({
            variables: {
              meetingID,
              notes,
            },
          }).then(mutationResultExtractor<IMeeting>("setNotes")),
      }),
    }
  )(component);
}

export function deleteMeeting<T>(component) {
  return graphql<any, T>(
    gql`
      mutation DeleteMeeting($meetingID: String!) {
        DeleteMeeting(meetingID: $meetingID)
      }
    `,
    {
      props: ({ mutate }) => ({
        deleteMeeting: (meetingID: string, beneficiaryID: string) =>
          mutate({
            variables: {
              meetingID,
            },
            refetchQueries: [
              {
                query: getMeetingsGQL,
                variables: { beneficiaryID },
              },
              {
                query: getAllMeetingsGQL,
                variables: { beneficiaryID },
              },
              {
                query: getRecentMeetingsGQL,
                variables: { page: 0, limit: 12 },
              },
            ],
          }),
      }),
    }
  )(component);
}

export interface IEditMeetingTags {
  editMeetingTags(meetingID: string, tags: string[]): Promise<IMeeting>;
}
export function editMeetingTags<T>(component) {
  return graphql<any, T>(
    gql`
      mutation EditMeetingTags($meetingID: String!, $tags: [String]) {
        editMeetingTags: EditMeetingTags(meetingID: $meetingID, tags: $tags) {
          ...meetingWithOutcomeSetAndAggregates
        }
      }
      ${fragmentWithOutcomeSetAndAggregates}
    `,
    {
      props: ({ mutate }) => ({
        editMeetingTags: (meetingID: string, tags: string[]) =>
          mutate({
            variables: {
              meetingID,
              tags: tags || [],
            },
          }).then(mutationResultExtractor<IMeeting>("editMeetingTags")),
      }),
    }
  )(component);
}

export interface IEditMeetingDate {
  editMeetingDate(meetingID: string, conducted: Date): Promise<IMeeting>;
}
export function editMeetingDate<T>(component) {
  return graphql<any, T>(
    gql`
      mutation EditMeetingDate($meetingID: String!, $conducted: String!) {
        editMeetingDate: EditMeetingDate(
          meetingID: $meetingID
          conducted: $conducted
        ) {
          ...meetingWithOutcomeSetAndAggregates
        }
      }
      ${fragmentWithOutcomeSetAndAggregates}
    `,
    {
      props: ({ mutate }) => ({
        editMeetingDate: (meetingID: string, conducted: Date) =>
          mutate({
            variables: {
              meetingID,
              conducted: conducted.toISOString(),
            },
          }).then(mutationResultExtractor<IMeeting>("editMeetingDate")),
      }),
    }
  )(component);
}

export interface IEditMeetingBeneficiary {
  editMeetingBeneficiary(
    meetingID: string,
    newBeneficiaryID: string
  ): Promise<IMeeting>;
}
export function editMeetingBeneficiary<T>(component) {
  return graphql<any, T>(
    gql`
      mutation EditMeetingBeneficiary(
        $meetingID: String!
        $newBeneficiaryID: String!
      ) {
        editMeetingBeneficiary: EditMeetingBeneficiary(
          meetingID: $meetingID
          newBeneficiaryID: $newBeneficiaryID
        ) {
          ...meetingWithOutcomeSetAndAggregates
        }
      }
      ${fragmentWithOutcomeSetAndAggregates}
    `,
    {
      props: ({ mutate }) => ({
        editMeetingBeneficiary: (meetingID: string, newBeneficiaryID: string) =>
          mutate({
            variables: {
              meetingID,
              newBeneficiaryID,
            },
            update: clearCacheOfAllMeetings(),
          }).then(mutationResultExtractor<IMeeting>("editMeetingBeneficiary")),
      }),
    }
  )(component);
}

export interface IMeetingResult extends QueryProps {
  getMeeting?: IMeeting;
  getMeetings?: IMeeting[];
}

export interface IGetAllMeetingsResult extends QueryProps {
  getIncompleteMeetings?: IMeeting[];
  getMeetings?: IMeeting[];
}

export interface IDeleteMeetingMutation {
  deleteMeeting?(meetingID: string, beneficiaryID: string);
}

export interface IExportMeetingsResult extends QueryProps {
  exportMeetings?: string;
}

export interface IMeetingMutation {
  newMeeting?(config: IAssessmentConfig): Promise<IMeeting>;
  newRemoteMeeting?(
    config: IAssessmentConfig,
    daysToComplete: number
  ): Promise<string>;
  addLikertAnswer?(
    meetingID: string,
    questionID: string,
    value: number,
    notes?: string
  ): Promise<IMeeting>;
  completeMeeting?(meetingID: string, beneficiaryID: string): Promise<IMeeting>;
}
