import * as React from 'react';
import {BeneficiaryForm, IFormOutput} from 'components/BeneficiaryForm';
import {
  IBeneficiaryResult, getBeneficiary, editBeneficiaryTags,
  IEditBeneficiaryTags,
} from 'apollo/modules/beneficiaries';
import {ApolloLoaderHoC} from '../../components/ApolloLoaderHoC';
import { ApolloError } from 'react-apollo';

interface IProps extends IEditBeneficiaryTags {
  match: {
    params: {
      id: string,
    },
  };
  data?: IBeneficiaryResult;
}

interface IState {
  formVersion: number;
}

const getBen = (p: IProps): string => p.match.params.id;

class BeneficiaryConfigInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      formVersion: 0,
    };
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  private onSave(v: IFormOutput): Promise<any> {
    return this.props.editBeneficiaryTags(getBen(this.props), v.tags)
      .then(() => {
        // if the beneficiary was missing, refresh the page to show the new tags
        if(this.props.data.error) {
          this.props.data.refetch().catch((e) => console.error(e));
        }
      });
  }

  private onCancel() {
    this.setState({
      formVersion: this.state.formVersion + 1,
    });
  }

  public render() {
    let tags: string[] = [];
    if(!this.props.data.error && this.props.data.getBeneficiary) {
      tags = this.props.data.getBeneficiary.tags;
    }
    return (
      <div>
        <BeneficiaryForm
          beneficiaryID={getBen(this.props)}
          onFormSubmit={this.onSave}
          onCancel={this.onCancel}
          tags={tags}
          key={this.state.formVersion}
        />
      </div>
    );
  }
}

const BeneficiaryConfigWithLoader = ApolloLoaderHoC<IProps>('beneficiary',
  (p: IProps) => p.data,
  BeneficiaryConfigInner,
  (e: ApolloError) => {
    // tags can be set on beneficiaries not currently in the system
    const notFound = e.graphQLErrors.length === 1 &&
      e.graphQLErrors[0].message.includes('not found');
    return !notFound;
  },
);
const BeneficiaryConfig = getBeneficiary<IProps>(getBen)(editBeneficiaryTags<IProps>(BeneficiaryConfigWithLoader));
export { BeneficiaryConfig };
