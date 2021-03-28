import React from 'react';
import {Loader} from 'semantic-ui-react';
import {IURLConnector} from 'redux/modules/url';
import {getAllMeetings, IGetAllMeetingsResult} from 'apollo/modules/meetings';
import {RecordList} from 'components/RecordList';
import {Error} from 'components/Error';
import {useTranslation} from 'react-i18next';

interface IProps extends IURLConnector {
  match: {
    params: {
      id: string,
    },
  };
  data?: IGetAllMeetingsResult;
}

const RecordsInner = (p: IProps) => {
  const {t} = useTranslation();

  const renderRecords = (): JSX.Element => {
    if (p.data.error) {
      return (<Error text={t("Failed to load records")} />);
    }
    if (p.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    const noCompleteMeetings = !Array.isArray(p.data.getMeetings) || p.data.getMeetings.length === 0;
    const noIncompleteMeetings = !Array.isArray(p.data.getIncompleteMeetings) || p.data.getIncompleteMeetings.length === 0;
    if (noCompleteMeetings && noIncompleteMeetings) {
      return (
        <p>{t("No meetings found for beneficiary {name}", {name: p.match.params.id})}</p>
      );
    }
    return (
      <RecordList meetings={[].concat(...p.data.getMeetings, ...p.data.getIncompleteMeetings)} />
    );
  }

  if(p.match.params.id === undefined) {
    return (<div />);
  }

  return (
    <div id="records">
      {renderRecords()}
    </div>
  );
}

const Records = getAllMeetings<IProps>((p) => p.match.params.id)(RecordsInner);
export { Records };
