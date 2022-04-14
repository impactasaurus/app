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
import { getRecentMeetings, IGetRecentMeetings } from "apollo/modules/meetings";

interface IProps {
  onChange: (
    ben: string,
    existing: boolean | undefined,
    selected: boolean
  ) => void;
  onBlur?: (ben: string) => void;
  onFocus?: () => void;
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

type SearchResults = ISearchResult[] | Record<string, ICategorisedSearchResult>;

const newBeneficiaryResult = (
  ben: string,
  t: (s: string, p: Record<string, string>) => string
): ISearchResult => ({
  title: ben,
  description: t(`Create {name}'s first record`, { name: ben }),
});

const getZeroStateResults = (r: IGetRecentMeetings): SearchResults => {
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
      return {
        recent: {
          name: "Recent Activity",
          results: recentBeneficiaries.map((b) => ({ title: b })),
        },
      };
    }
  }
  return [];
};

const BeneficiaryInputInner = (p: IProps) => {
  const [benID, setBenID] = useState<string>(undefined);
  const [searchResults, setSearchResults] = useState<SearchResults>([]);
  const [search, setSearch] = useState<string>("");
  const { t } = useTranslation();
  const zeroState = useMemo(() => getZeroStateResults(p.recent), [p.recent]);

  useEffect(() => {
    if (search.length === 0) {
      setSearchResults(zeroState);
      return;
    }

    if (!p.bens.getBeneficiaries) {
      setSearchResults([newBeneficiaryResult(search, t)]);
      return;
    }

    const re = new RegExp(escapeStringRegexp(search), "i");
    const isMatch = (x: string) => re.test(x);
    const matchingBens = p.bens.getBeneficiaries.filter(isMatch);

    const searchResults = matchingBens.map((b) => ({
      title: b,
    }));

    const exactMatch = p.bens.getBeneficiaries.find((b) => b === search);
    if (exactMatch === undefined) {
      searchResults.push(newBeneficiaryResult(search, t));
    }

    setSearchResults(searchResults);
  }, [search, zeroState, p.bens]);

  const onChange = (benID: string, selected: boolean) => {
    setBenID(benID);
    if (p.onChange) {
      let existingBen = false;
      try {
        existingBen =
          p.bens.getBeneficiaries.find((b) => b === benID) !== undefined;
      } catch {}
      p.onChange(benID, existingBen, selected);
    }
  };

  const onSearchResultSelect = (_, data: SearchResultData) => {
    onChange(data.result.title, true);
  };

  const onBlur = () => {
    if (p.onBlur) {
      p.onBlur(benID);
    }
  };

  const handleSearchChange = (_, { value }) => {
    setSearch(value);
    onChange(value, false);
  };

  const noResultMessage = (): string => {
    // no results only happen in the zero state
    if (p.recent.error) {
      return t("Failed to load {entity}", {
        entity: t("beneficiaries with recent activity"),
      });
    }
    if (p.recent.loading) {
      return t("Loading...");
    }
    // this will be for new organisations without any previous records
    return t(
      "No need to tell us your beneficiary's life story, just provide an ID so we can identify them in future"
    );
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
        noResultsMessage={noResultMessage()}
        input={
          <Input type="text" placeholder={t("Beneficiary")} icon={false} />
        }
        id={p.inputID}
        minCharacters={0}
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
