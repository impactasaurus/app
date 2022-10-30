import React from "react";
import { Button } from "semantic-ui-react";
import { useNavigator } from "redux/modules/url";
import { getMeeting, IMeetingResult } from "apollo/modules/meetings";
import { RecordQuestionSummary } from "components/RecordQuestionSummary";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { useTranslation } from "react-i18next";
import { ISODateString } from "components/Moment";
import { forward, ISearchParam } from "helpers/url";
import "./style.less";

interface IProps extends ISearchParam {
  match: {
    params: {
      id: string;
    };
  };
  data: IMeetingResult;
}

const RecordViewInner = (p: IProps) => {
  const { t } = useTranslation();
  const setURL = useNavigator();

  const nextPage = () => {
    if (!forward(p, setURL)) {
      const ben = p.data?.getMeeting?.beneficiary;
      setURL(ben ? `/beneficiary/${ben}` : "/");
    }
  };

  const noop = (): Promise<void> => {
    return Promise.resolve();
  };

  if (p.match.params.id === undefined) {
    return <div />;
  }

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
          <h4 className="label inline">{t("Created")}</h4>
          <span className="conductedDate">
            <ISODateString iso={record.created} />
          </span>
        </div>
        {!record.incomplete && (
          <div>
            <h4 className="label inline">{t("Completed")}</h4>
            <span className="completedDate">
              <ISODateString iso={record.date} />
            </span>
          </div>
        )}
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
const RecordView = PageWrapperHoC("View Record", "record-view", RecordViewData);
export { RecordView };
