import React, { useState } from "react";
import { Search, Input, SearchResultData } from "semantic-ui-react";
import {
  getBeneficiaries,
  IBeneficiariesResult,
} from "apollo/modules/beneficiaries";
import { useTranslation } from "react-i18next";
import escapeStringRegexp from "escape-string-regexp";
import "./style.less";

interface IProps {
  onChange?: (ben: string, existing: boolean | undefined) => void;
  onBlur?: (ben: string) => void;
  onFocus?: () => void;
  allowUnknown?: boolean; // defaults to false
  inputID?: string;

  bens?: IBeneficiariesResult;
}

const BeneficiaryInputInner = (p: IProps) => {
  const [benID, setBenID] = useState<string>(undefined);
  const [searchResults, setSearchResults] =
    useState<{ title: string; description?: string }[]>(undefined);
  const { t } = useTranslation();

  const onChange = (benID) => {
    setBenID(benID);
    if (p.onChange) {
      let existingBen = false;
      try {
        existingBen =
          p.bens.getBeneficiaries.find((b) => b === benID) !== undefined;
      } catch {}
      p.onChange(benID, existingBen);
    }
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
    onChange(value);
    const newBeneficiaryResult = {
      title: value,
      description: t(`Create {name}'s first record`, { name: value }),
    };

    if (!p.bens.getBeneficiaries || value.length < 1) {
      const noMatches = [];
      if (p.allowUnknown === true) {
        noMatches.push(newBeneficiaryResult);
      }
      setSearchResults(noMatches);
      return;
    }

    const re = new RegExp(escapeStringRegexp(value), "i");
    const isMatch = (x: string) => re.test(x);
    const matchingBens = p.bens.getBeneficiaries.filter(isMatch);

    const searchResults = matchingBens.map((b) => ({
      title: b,
    }));

    const exactMatch = p.bens.getBeneficiaries.find((b) => b === value);
    if (exactMatch === undefined && p.allowUnknown === true) {
      searchResults.push(newBeneficiaryResult);
    }

    setSearchResults(searchResults);
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
      />
    </div>
  );
};

export const BeneficiaryInput = getBeneficiaries<IProps>(
  BeneficiaryInputInner,
  "bens"
);
