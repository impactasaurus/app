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
import { generateSummon, IGenerateSummon } from "../../apollo/modules/summon";
import { useTranslation } from "react-i18next";
import { PageWrapper } from "components/PageWrapperHoC";
import { QuestionnaireLink } from "./link";
import { AssessmentConfigForm } from "./form";

interface IProps extends IMeetingMutation, IGenerateSummon {
  match: {
    params: {
      type: string;
    };
  };
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

  const startSummon = (qID: string): Promise<void> => {
    if (typ !== AssessmentType.summon) {
      return Promise.reject("unexpected error");
    }
    return p.generateSummon(qID).then((smn) => {
      setLink(`smn/${smn}`);
    });
  };

  const startRemote = (c: IAssessmentConfig): Promise<void> => {
    return p.newRemoteMeeting(c, defaultRemoteMeetingLimit).then((jti) => {
      setLink(`jti/${jti}`);
    });
  };

  const startMeeting = (c: IAssessmentConfig): Promise<void> => {
    if (typ !== AssessmentType.historic) {
      c.date = new Date();
    }
    return p.newMeeting(c).then((meeting) => {
      if (typ === AssessmentType.historic) {
        setURL(`/dataentry/${meeting.id}`);
      } else {
        setURL(`/meeting/${meeting.id}`);
      }
    });
  };

  const start = (inp: IAssessmentConfig | string): Promise<void> => {
    if (typeof inp === "string") {
      return startSummon(inp);
    } else if (typ === AssessmentType.remote) {
      return startRemote(inp);
    } else {
      return startMeeting(inp);
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
  newMeeting(generateSummon(AssessmentConfigInner))
);
