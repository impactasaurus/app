import React, { useEffect, useState } from "react";
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

interface IProps {
  onChange?: (ben: string, existing: boolean | undefined) => void;
  onBlur?: (ben: string) => void;
  onFocus?: () => void;
  allowUnknown?: boolean; // defaults to false
  inputID?: string;

  bens?: IBeneficiariesResult;
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

const exampleCategories = {
  "Recently viewed": {
    name: "Recently viewed",
    results: [
      {
        title: "John Doe",
      },
      {
        title: "Xav T",
      },
    ],
  },
  "Recent activity": {
    name: "Recent activity",
    results: [
      {
        title: "Dari",
      },
      {
        title: "Logan",
      },
    ],
  },
};

const BeneficiaryInputInner = (p: IProps) => {
  const [benID, setBenID] = useState<string>(undefined);
  const [searchResults, setSearchResults] =
    useState<ISearchResult[] | Record<string, ICategorisedSearchResult>>(
      exampleCategories
    );
  const [search, setSearch] = useState<string>("");
  const { t } = useTranslation();

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
      setSearchResults(exampleCategories);
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
  }, [search]);

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
        loading={p.bens.loading}
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
        minCharacters={0}
        categoryLayoutRenderer={categoryLayoutRenderer}
        categoryRenderer={categoryRenderer}
        resultRenderer={resultRenderer}
        category={!Array.isArray(searchResults)}
      />
    </div>
  );
};

export const BeneficiaryInput = getBeneficiaries<IProps>(
  BeneficiaryInputInner,
  "bens"
);
