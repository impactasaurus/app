import {constructReportQueryParams, constructReportURL} from 'helpers/report';
import {IURLConnector} from 'redux/modules/url';
import {Message} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import * as React from 'react';
import {IExclusion} from 'models/report';
import { useTranslation, Trans } from 'react-i18next';

export interface IReportOptions {
  start: Date;
  end: Date;
  questionnaire: string;
  tags: string[];
  openStart: boolean;
  orTags: boolean;
}

export const exportReportData = (urlConn: IURLConnector, p: IReportOptions): void => {
  const url = constructReportURL('export', p.start, p.end, p.questionnaire);
  const qp = constructReportQueryParams(p.tags, p.openStart, p.orTags);
  urlConn.setURL(url, qp);
};

export const NoRecordsMessage = (): JSX.Element => {
  const {t} = useTranslation();
  return (
    <Message warning={true}>
      <Message.Header>{t("No Records")}</Message.Header>
      <Trans
        defaults={"<p>We couldn't generate your report as we found no records. This may be because:</p><p>There are no records in the system, <recordLink>click here to create some</recordLink></p><p>or</p><p>The report's time range didn't contain any records</p>"}
        components={{
          p: <p />,
          recordLink: <Link to="/record" />
        }}
      />
    </Message>
  );
};

export const NeedMoreRecordsMessage = (): JSX.Element => {
  const {t} = useTranslation();
  return (
    <Message warning={true}>
      <Message.Header>{t("We Need More Records")}</Message.Header>
      <Trans
        defaults={"<p>When generating your report, we only found beneficiaries with one record for the time range specified</p><p>This report requires <b>at least two records</b> to determine your impact</p><p>The Status report can be used to visualise the data you have collected so far</p>"}
        components={{
          p: <p />,
          b: <b />
        }}
      />
    </Message>
  );
};

export const EmptyReportMessage = (p: {ie: IExclusion[]}): JSX.Element => {
  const unqiueExcludedBens = p.ie
    .filter((e) => e.beneficiary)
    .filter((e, i, a) => a.indexOf(e) === i);
  if (unqiueExcludedBens.length > 0) {
    return <NeedMoreRecordsMessage />;
  }
  return <NoRecordsMessage />;
};
