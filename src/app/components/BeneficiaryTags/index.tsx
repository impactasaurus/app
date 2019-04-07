import * as React from 'react';
import {getBeneficiary, IBeneficiaryResult} from '../../apollo/modules/beneficiaries';
import {Tags} from '../Tag';

interface IProps {
  beneficiaryID: string;
  data?: IBeneficiaryResult;
}

class BeneficiaryTagsInner extends React.Component<IProps, any> {
  public render() {
    if (this.props.data.loading || this.props.data.error ||
      this.props.data.getBeneficiary === undefined || this.props.data.getBeneficiary.tags.length === 0) {
      return <div />;
    }
    return <Tags benTags={this.props.data.getBeneficiary.tags} recordTags={[]}/>;
  }
}

const BeneficiaryTags = getBeneficiary((p: IProps) => p.beneficiaryID)(BeneficiaryTagsInner);
export {BeneficiaryTags};
