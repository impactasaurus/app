import React, {useState} from 'react';
import {isNullOrUndefined} from 'util';
import {Search, Input, InputOnChangeData, SearchResultData} from 'semantic-ui-react';
import {getBeneficiaries, IBeneficiariesResult} from 'apollo/modules/beneficiaries';
import {getOrganisation, IGetOrgResult} from 'apollo/modules/organisation';
import { useTranslation } from 'react-i18next';
const escapeStringRegexp = require('escape-string-regexp');
import './style.less';

interface IProps {
  onChange?: (ben: string, existing: boolean|undefined) => void;
  onBlur?: (ben: string) => void;
  onFocus?: () => void;
  allowUnknown?: boolean; // defaults to false
  inputID?: string;

  bens?: IBeneficiariesResult;
  data?: IGetOrgResult;
}

const BeneficiaryInputInner = (p: IProps) => {
  const [benID, setBenID] = useState<string>(undefined);
  const [searchResults, setSearchResults] = useState<{title: string, description?: string}[]>(undefined);
  const {t} = useTranslation();


  const onChange = (benID) => {
    setBenID(benID);
    if (p.onChange) {
      let existingBen = false;
      try {
        existingBen = p.bens.getBeneficiaries.find((b) => b === benID) !== undefined;
      } catch {}
      p.onChange(benID, existingBen);
    }
  }

  const onInputChange = (_, data: InputOnChangeData) => {
    onChange(data.value);
  }

  const onSearchResultSelect = (_, data: SearchResultData) => {
    onChange(data.result.title);
    if (p.onBlur) {
      p.onBlur(data.result.title);
    }
  }

  const onBlur = () => {
    if (p.onBlur) {
      p.onBlur(benID);
    }
  }

  const handleSearchChange = (_, { value }) => {
    onChange(value);
    const newBeneficiaryResult = {
      title: value,
      description: t(`Create {name}'s first record`, {name: value}),
    };

    if (isNullOrUndefined(p.bens.getBeneficiaries) || value.length < 1) {
      const noMatches = [];
      if (p.allowUnknown === true) {
        noMatches.push(newBeneficiaryResult);
      }
      setSearchResults(noMatches);
      return;
    }

    const re = new RegExp(escapeStringRegexp(value), 'i');
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
  }

  let shouldShowTypeahead = false;
  if (!isNullOrUndefined(p.data.getOrganisation)) {
    shouldShowTypeahead = p.data.getOrganisation.settings.beneficiaryTypeAhead;
  }
  if (shouldShowTypeahead) {
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
          input={<Input type="text" placeholder={t("Beneficiary")} icon={false}/>}
          id={p.inputID}
        />
      </div>
    );
  }
  return (
    <Input type="text" placeholder={t("Beneficiary")} onChange={onInputChange} onBlur={onBlur} onFocus={p.onFocus} />
  );
}

const BeneficiaryInput = getOrganisation<IProps>(getBeneficiaries<IProps>(BeneficiaryInputInner, 'bens'));
export {BeneficiaryInput};
