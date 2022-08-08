import * as React from "react";
import {
  getBeneficiary,
  IBeneficiaryResult,
} from "../../apollo/modules/beneficiaries";
import { Tags } from "../Tag";

interface IProps {
  beneficiaryID: string;
  data?: IBeneficiaryResult;
}

const BeneficiaryTagsInner = (props: IProps): JSX.Element => {
  const { data } = props;

  if (
    data.loading ||
    data.error ||
    data.getBeneficiary === undefined ||
    data.getBeneficiary.tags.length === 0
  ) {
    return <div />;
  }
  return <Tags benTags={data.getBeneficiary.tags} recordTags={[]} />;
};

const BeneficiaryTags = getBeneficiary((p: IProps) => p.beneficiaryID)(
  BeneficiaryTagsInner
);
export { BeneficiaryTags };
