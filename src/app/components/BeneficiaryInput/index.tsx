import React, { useEffect, useMemo, useState } from "react";
import { Search, Input, SearchResultData } from "semantic-ui-react";
import {
  getBeneficiaries,
  IBeneficiariesResult,
} from "apollo/modules/beneficiaries";
import { useTranslation } from "react-i18next";
import escapeStringRegexp from "escape-string-regexp";
import "./style.less";
import {
  categoryLayoutRenderer,
  categoryRenderer,
  resultRenderer,
} from "./renderers";
import { useNonInitialEffect } from "helpers/hooks/useNonInitialEffect";
import { getRecentMeetings, IGetRecentMeetings } from "apollo/modules/meetings";

interface IProps {
  onChange?: (ben: string, existing: boolean | undefined) => void;
  onBlur?: (ben: string) => void;
  onFocus?: () => void;
  allowUnknown?: boolean; // defaults to false
  inputID?: string;

  bens?: IBeneficiariesResult;
  recent?: IGetRecentMeetings;
}

interface ISearchResult {
  title: string;
  description?: string;
}
interface ICategorisedSearchResult {
  name: string;
  results: ISearchResult[];
}

const newBeneficiaryResult = (
  ben: string,
  t: (s: string, p: Record<string, string>) => string
): ISearchResult => ({
  title: ben,
  description: t(`Create {name}'s first record`, { name: ben }),
});

const getZeroStateResults = (
  r: IGetRecentMeetings
): Record<string, ICategorisedSearchResult> | undefined => {
  const results: Record<string, ICategorisedSearchResult> = {};
  if (
    !r.error &&
    !r.loading &&
    r.getRecentMeetings &&
    Array.isArray(r.getRecentMeetings?.meetings)
  ) {
    if (r.getRecentMeetings.meetings.length > 0) {
      const recentBeneficiaries = r.getRecentMeetings.meetings
        .map((m) => m.beneficiary)
        .reduce<string[]>((bens, b) => {
          return bens.indexOf(b) === -1 ? bens.concat(b) : bens;
        }, []);
      results["recent"] = {
        name: "Recent Activity",
        results: recentBeneficiaries.map((b) => ({ title: b })),
      };
    }
  }
  return Object.keys(results).length === 0 ? undefined : results;
};

const BeneficiaryInputInner = (p: IProps) => {
  const [benID, setBenID] = useState<string>(undefined);
  const [searchResults, setSearchResults] = useState<
    ISearchResult[] | Record<string, ICategorisedSearchResult>
  >([]);
  const [search, setSearch] = useState<string>("");
  const { t } = useTranslation();
  const zeroState = useMemo(() => getZeroStateResults(p.recent), [p.recent]);

  useNonInitialEffect(() => {
    onChange(search);
  }, [search]);

  useNonInitialEffect(() => {
    if (p.onChange) {
      let existingBen = false;
      try {
        existingBen =
          p.bens.getBeneficiaries.find((b) => b === benID) !== undefined;
      } catch {}
      p.onChange(benID, existingBen);
    }
  }, [benID]);

  useEffect(() => {
    if (search.length === 0) {
      setSearchResults(zeroState);
      return;
    }

    if (!p.bens.getBeneficiaries) {
      const results = [];
      if (p.allowUnknown === true) {
        results.push(newBeneficiaryResult(search, t));
      }
      setSearchResults(results);
      return;
    }

    const re = new RegExp(escapeStringRegexp(search), "i");
    const isMatch = (x: string) => re.test(x);
    const matchingBens = p.bens.getBeneficiaries.filter(isMatch);

    const searchResults = matchingBens.map((b) => ({
      title: b,
    }));

    const exactMatch = p.bens.getBeneficiaries.find((b) => b === search);
    if (exactMatch === undefined && p.allowUnknown === true) {
      searchResults.push(newBeneficiaryResult(search, t));
    }

    setSearchResults(searchResults);
  }, [search, zeroState, p.bens, p.allowUnknown]);

  const onChange = (benID) => {
    setBenID(benID);
  };

  const onSearchResultSelect = (_, data: SearchResultData) => {
    onChange(data.result.title);
    if (p.onBlur) {
      p.onBlur(data.result.title);
    }
  };

  const onBlur = () => {
    if (p.onBlur) {
      p.onBlur(benID);
    }
  };

  const handleSearchChange = (_, { value }) => {
    setSearch(value);
  };

  return (
    <div className="beneficiary-input">
      <Search
        loading={p.bens.loading || p.recent.loading}
        onResultSelect={onSearchResultSelect}
        onSearchChange={handleSearchChange}
        results={searchResults}
        onBlur={onBlur}
        onFocus={p.onFocus}
        icon={undefined}
        fluid={true}
        showNoResults={true}
        noResultsMessage={t("Unknown beneficiary")}
        input={
          <Input type="text" placeholder={t("Beneficiary")} icon={false} />
        }
        id={p.inputID}
        minCharacters={zeroState === undefined ? 1 : 0}
        categoryLayoutRenderer={categoryLayoutRenderer}
        categoryRenderer={categoryRenderer}
        resultRenderer={resultRenderer}
        category={!Array.isArray(searchResults)}
      />
    </div>
  );
};

export const BeneficiaryInput = getRecentMeetings<IProps>({ name: "recent" })(
  getBeneficiaries<IProps>(BeneficiaryInputInner, "bens")
);
