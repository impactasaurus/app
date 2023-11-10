import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  IMeetingMutation,
  newMeeting,
  newRemoteMeeting,
} from "apollo/modules/meetings";
import { useNavigator } from "redux/modules/url";
import {
  AssessmentType,
  IAssessmentConfig,
  defaultRemoteMeetingLimit,
} from "models/assessment";
import { Message } from "semantic-ui-react";
import {
  generateSequenceSummon,
  generateSummon,
  IGenerateSequenceSummon,
  IGenerateSummon,
} from "../../apollo/modules/summon";
import { useTranslation } from "react-i18next";
import { PageWrapper } from "components/PageWrapperHoC";
import { QuestionnaireLink } from "./link";
import { AssessmentConfigForm } from "./form";
import {
  IStartRemoteSequence,
  IStartSequence,
  startRemoteSequence,
  startSequence,
} from "apollo/modules/sequence";
import { QuestionnairishType } from "components/QuestionnairesAndSequencesHoC";
import { externalLinkURI, forwardURLParam, isUrlAbsolute } from "helpers/url";
import { ISummonConfig } from "./summonConfig";
import { IGetOrgResult, getOrganisation } from "apollo/modules/organisation";
import { Encode } from "helpers/summon";

interface IProps
  extends IMeetingMutation,
    IGenerateSummon,
    IStartSequence,
    IStartRemoteSequence,
    IGenerateSequenceSummon {
  match: {
    params: {
      type: string;
    };
  };
  org?: IGetOrgResult;
}

const Wrapper = (p: {
  children: JSX.Element;
  type: AssessmentType;
}): JSX.Element => {
  const { t } = useTranslation();
  const title =
    p.type === AssessmentType.summon || p.type === AssessmentType.remote
      ? t("New Link")
      : t("New Record");
  return (
    <PageWrapper id="assessment-config">
      <Helmet title={title} />
      <h1>{title}</h1>
      {p.children}
    </PageWrapper>
  );
};

const UnknownType = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Message error={true}>
      <Message.Header>{t("Error")}</Message.Header>
      <div>{t("Unknown assessment type")}</div>
    </Message>
  );
};

const AssessmentConfigInner = (p: IProps) => {
  const setURL = useNavigator();
  const [typ, setType] = useState<AssessmentType>(
    AssessmentType[p.match.params.type]
  );
  const [link, setLink] = useState<string>();

  const startSummon = (c: ISummonConfig, ben?: string): Promise<void> => {
    if (typ !== AssessmentType.summon && typ !== AssessmentType.remote) {
      return Promise.reject("unexpected error");
    }
    const promFn =
      c.qishType === QuestionnairishType.QUESTIONNAIRE
        ? p.generateSummon
        : p.generateSequenceSummon;
    return promFn(c.qishID, c.tags).then((smn) => {
      setLink(`smn/${Encode(smn, ben)}`);
    });
  };

  const startRemote = (c: IAssessmentConfig): Promise<void> => {
    // by default, for single beneficiary links, we use specalised summons
    // so that the link can be reused multiple times
    const orgPlugins = (p.org?.getOrganisation?.plugins || []).map((p) => p.id);
    const noSingleBenSummons =
      orgPlugins.indexOf("no-single-ben-summon") !== -1;
    if (noSingleBenSummons) {
      const promFn =
        c.qishType === QuestionnairishType.QUESTIONNAIRE
          ? p.newRemoteMeeting
          : p.startRemoteSequence;
      return promFn(c, defaultRemoteMeetingLimit).then((jti) => {
        setLink(`jti/${jti}`);
      });
    }
    return startSummon(
      {
        qishID: c.qishID,
        qishType: c.qishType,
        tags: c.tags,
      },
      c.beneficiaryID
    );
  };

  const startMeeting = (c: IAssessmentConfig): Promise<void> => {
    let promise: Promise<string[]>;
    if (c.qishType === QuestionnairishType.QUESTIONNAIRE) {
      promise = p.newMeeting(c).then((meeting) => [meeting.id]);
    } else {
      promise = p.startSequence(c).then((seqRes) => {
        const mm = seqRes.meetings.map((m) => m.id);
        return seqRes.destination ? mm.concat(seqRes.destination) : mm;
      });
    }
    return promise
      .then((mm) => {
        const meetingTemplate = (id: string) =>
          typ === AssessmentType.historic
            ? `/dataentry/${id}`
            : `/meeting/${id}`;
        return mm.map((s) =>
          isUrlAbsolute(s) ? externalLinkURI(s) : meetingTemplate(s)
        );
      })
      .then(([initial, ...rest]) => {
        setURL(initial, forwardURLParam(rest));
      });
  };

  const start = (inp: IAssessmentConfig | ISummonConfig): Promise<void> => {
    if (typ === AssessmentType.summon) {
      return startSummon(inp as ISummonConfig);
    } else if (typ === AssessmentType.remote) {
      return startRemote(inp as IAssessmentConfig);
    } else {
      return startMeeting(inp as IAssessmentConfig);
    }
  };

  if (typ === undefined) {
    return (
      <Wrapper type={typ}>
        <UnknownType />
      </Wrapper>
    );
  }
  if (link !== undefined) {
    return (
      <Wrapper type={typ}>
        <QuestionnaireLink link={link} typ={typ} />
      </Wrapper>
    );
  }

  return (
    <Wrapper type={typ}>
      <AssessmentConfigForm start={start} onChangeType={setType} type={typ} />
    </Wrapper>
  );
};

export const AssessmentConfig = newRemoteMeeting<IProps>(
  newMeeting(
    generateSummon(
      startSequence(
        startRemoteSequence(
          generateSequenceSummon(getOrganisation(AssessmentConfigInner, "org"))
        )
      )
    )
  )
);
