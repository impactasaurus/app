import React from "react";
import { Button } from "semantic-ui-react";
import { IURLConnector, UrlHOC } from "redux/modules/url";
import { getMeeting, IMeetingResult } from "apollo/modules/meetings";
import { RecordQuestionSummary } from "components/RecordQuestionSummary";
import { getHumanisedDateFromISO } from "helpers/moment";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { useTranslation } from "react-i18next";
import "./style.less";

interface IProps extends IURLConnector {
  match: {
    params: {
      id: string;
    };
  };
  location: {
    // can provide a ?next=relativeURL which the user will be taken to on cancel or successful save
    search: string;
  };
  data: IMeetingResult;
}

function getNextPageURL(p: IProps): string | undefined {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has("next") === false) {
    return undefined;
  }
  return urlParams.get("next");
}

const RecordViewInner = (p: IProps) => {
  const nextPage = () => {
    const nextPage = getNextPageURL(p);
    if (nextPage !== undefined) {
      p.setURL(nextPage);
      return;
    }
    const record = p.data.getMeeting;
    if (record !== undefined) {
      p.setURL(`/beneficiary/${record.beneficiary}`);
      return;
    }
    p.setURL("/");
  };

  const noop = (): Promise<void> => {
    return Promise.resolve();
  };

  if (p.match.params.id === undefined) {
    return <div />;
  }

  const { t } = useTranslation();
  const record = p.data.getMeeting;
  return (
    <div>
      <div className="impactform">
        <div>
          <h4 className="label inline">{t("Beneficiary")}</h4>
          <span>{record.beneficiary}</span>
        </div>
        <div>
          <h4 className="label inline">{t("Questionnaire")}</h4>
          <span>{record.outcomeSet.name}</span>
        </div>
        <div>
          <h4 className="label inline">{t("Date Conducted")}</h4>
          <span className="conductedDate">
            {getHumanisedDateFromISO(record.conducted)}
          </span>
        </div>
      </div>
      <RecordQuestionSummary
        recordID={p.match.params.id}
        onQuestionClick={noop}
      />
      <div>
        <Button className="back" onClick={nextPage}>
          {t("Back")}
        </Button>
      </div>
    </div>
  );
};

// t("record")
const RecordViewLoader = ApolloLoaderHoC(
  "record",
  (p: IProps) => p.data,
  RecordViewInner
);
const RecordViewData = getMeeting<IProps>((props) => props.match.params.id)(
  RecordViewLoader
);
// t("View Record")
const RecordViewPage = PageWrapperHoC(
  "View Record",
  "record-view",
  RecordViewData
);
const RecordView = UrlHOC(RecordViewPage);
export { RecordView };
