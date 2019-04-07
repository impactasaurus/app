import * as React from 'react';
import {isNullOrUndefined} from 'util';
import {Search, Input} from 'semantic-ui-react';
import {getBeneficiaries, IBeneficiariesResult} from 'apollo/modules/beneficiaries';
import {getOrganisation, IGetOrgResult} from 'apollo/modules/organisation';
import './style.less';
const escapeStringRegexp = require('escape-string-regexp');

interface IProps {
  onChange?: (ben: string, existing: boolean|undefined) => void;
  onBlur?: (ben: string) => void;
  onFocus?: () => void;
  allowUnknown?: boolean; // defaults to false
  inputID?: string;

  bens?: IBeneficiariesResult;
  data?: IGetOrgResult;
}

interface IState {
  benID?: string;
  searchResults?: any[];
}

class BeneficiaryInputInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.onSearchResultSelect = this.onSearchResultSelect.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  private onChange(benID) {
    this.setState({
      benID,
    });
    if (!isNullOrUndefined(this.props.onChange)) {
      let existingBen;
      try {
        existingBen = this.props.bens.getBeneficiaries.find((b) => b === benID) !== undefined;
      } catch {}
      this.props.onChange(benID, existingBen);
    }
  }

  private onInputChange(_, data) {
    this.onChange(data.value);
  }

  private onSearchResultSelect(_, data) {
    this.onChange(data.result.title);
    if (!isNullOrUndefined(this.props.onBlur)) {
      this.props.onBlur(data.result.title);
    }
  }

  private onBlur() {
    if (!isNullOrUndefined(this.props.onBlur)) {
      this.props.onBlur(this.state.benID);
    }
  }

  private handleSearchChange(_, { value }) {
    this.onChange(value);
    const newBeneficiaryResult = {
      title: value,
      description: `Create ${value}'s first record`,
    };

    if (isNullOrUndefined(this.props.bens.getBeneficiaries) || value.length < 1) {
      const noMatches = [];
      if (this.props.allowUnknown === true) {
        noMatches.push(newBeneficiaryResult);
      }
      return this.setState({
        searchResults: noMatches,
      });
    }

    const re = new RegExp(escapeStringRegexp(value), 'i');
    const isMatch = (x) => re.test(x);
    const matchingBens = this.props.bens.getBeneficiaries.filter(isMatch);

    const searchResults = matchingBens.map((b) => ({
      title: b,
    }));

    const exactMatch = this.props.bens.getBeneficiaries.find((b) => b === value);
    if (exactMatch === undefined && this.props.allowUnknown === true) {
      searchResults.push(newBeneficiaryResult);
    }

    this.setState({
      searchResults,
    });
  }

  public render() {
    let shouldShowTypeahead = false;
    if (!isNullOrUndefined(this.props.data.getOrganisation)) {
      shouldShowTypeahead = this.props.data.getOrganisation.settings.beneficiaryTypeAhead;
    }
    if (shouldShowTypeahead) {
      return (
        <div className="beneficiary-input">
          <Search
            loading={this.props.bens.loading}
            onResultSelect={this.onSearchResultSelect}
            onSearchChange={this.handleSearchChange}
            results={this.state.searchResults}
            onBlur={this.onBlur}
            onFocus={this.props.onFocus}
            icon={undefined}
            fluid={true}
            showNoResults={true}
            noResultsMessage="Unknown beneficiary"
            input={<Input type="text" placeholder="Beneficiary" icon={false}/>}
            id={this.props.inputID}
          />
        </div>
      );
    }
    return (
      <Input type="text" placeholder="Beneficiary" onChange={this.onInputChange} onBlur={this.onBlur} onFocus={this.props.onFocus} />
    );
  }
}

const BeneficiaryInput = getOrganisation<IProps>(getBeneficiaries<IProps>(BeneficiaryInputInner, 'bens'));
export {BeneficiaryInput};
