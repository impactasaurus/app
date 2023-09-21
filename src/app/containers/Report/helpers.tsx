import * as React from "react";
import { Message } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IExclusion } from "models/report";
import { useTranslation, Trans } from "react-i18next";
import { getJSONFromURL } from "helpers/url";

export interface IReportOptions extends IUserReportOptions {
  minRecords: number;
}

export interface IUserReportOptions {
  start: Date;
  end: Date;
  questionnaire: string;
  tags: string[];
  openStart: boolean;
  orTags: boolean;
}

export const getURLReportOptions = (
  urlParams: {
    questionSetID: string;
    start: string;
    end: string;
  },
  searchParams: URLSearchParams
): IReportOptions => {
  const userOpts = getURLUserReportOptions(urlParams, searchParams);
  return {
    minRecords: getJSONFromURL<number>(searchParams, "min", 2),
    ...userOpts,
  };
};

export const getURLUserReportOptions = (
  urlParams: {
    questionSetID: string;
    start: string;
    end: string;
  },
  searchParams: URLSearchParams
): IUserReportOptions => {
  return {
    questionnaire: urlParams.questionSetID,
    start: new Date(urlParams.start),
    end: new Date(urlParams.end),
    tags: getJSONFromURL<string[]>(searchParams, "tags", []),
    openStart: getJSONFromURL<boolean>(searchParams, "open", true),
    orTags: getJSONFromURL<boolean>(searchParams, "or", false),
  };
};

export const reportURL = (
  reportType: string,
  opts: IUserReportOptions
): {
  url: string;
  params: URLSearchParams;
} => {
  const encodeDatePathParam = (d: Date): string => {
    // had lots of issues with full stops being present in path parameters...
    return d.toISOString().replace(/\.[0-9]{3}/, "");
  };

  const s = encodeDatePathParam(opts.start);
  const e = encodeDatePathParam(opts.end);
  const url = `/report/${reportType}/${opts.questionnaire}/${s}/${e}`;

  const params = new URLSearchParams();
  if (Array.isArray(opts?.tags) && opts.tags.length > 0) {
    params.set("tags", JSON.stringify(opts.tags));
  }
  if (typeof opts?.openStart === "boolean") {
    params.set("open", JSON.stringify(opts.openStart));
  }
  if (typeof opts?.orTags === "boolean") {
    params.set("or", JSON.stringify(opts.orTags));
  }

  return {
    url,
    params,
  };
};

export const exportReportData = (
  setURL: (url: string, qp: URLSearchParams) => void,
  p: IReportOptions
): void => {
  const { url, params } = reportURL("export", p);
  if (typeof p?.minRecords === "number") {
    params.set("min", JSON.stringify(p.minRecords));
  }
  setURL(url, params);
};

export const NoRecordsMessage = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Message warning={true}>
      <Message.Header>{t("No Records")}</Message.Header>
      <Trans
        defaults={
          "<p>We couldn't generate your report as we found no records. This may be because:</p><p>There are no records in the system, <recordLink>click here to create some</recordLink></p><p>or</p><p>The report's time range didn't contain any records</p>"
        }
        components={{
          p: <p />,
          recordLink: <Link to="/record" />,
        }}
      />
    </Message>
  );
};

export const NeedMoreRecordsMessage = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Message warning={true}>
      <Message.Header>{t("We Need More Records")}</Message.Header>
      <Trans
        defaults={
          "<p>When generating your report, we only found beneficiaries with one record for the time range specified</p><p>This report requires <b>at least two records</b> to determine your impact</p><p>The Status report can be used to visualise the data you have collected so far</p>"
        }
        components={{
          p: <p />,
          b: <b />,
        }}
      />
    </Message>
  );
};

export const EmptyReportMessage = (p: { ie: IExclusion[] }): JSX.Element => {
  const unqiueExcludedBens = p.ie
    .filter((e) => e.beneficiary)
    .filter((e, i, a) => a.indexOf(e) === i);
  if (unqiueExcludedBens.length > 0) {
    return <NeedMoreRecordsMessage />;
  }
  return <NoRecordsMessage />;
};
