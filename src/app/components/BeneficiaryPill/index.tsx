import * as React from "react";
import { Label } from "semantic-ui-react";
import { journeyURI } from "helpers/url";

interface IProps {
  beneficiaryID: string;
  // optional, if provided, will show that questionnaire by default when opening the beneficiary's page
  questionnaireID?: string;
}

const BeneficiaryPill = (props: IProps): JSX.Element => {
  const { beneficiaryID, questionnaireID } = props;
  const link = journeyURI(beneficiaryID, questionnaireID);

  return (
    <Label as="a" target="_blank" href={link} key={beneficiaryID}>
      {beneficiaryID}
    </Label>
  );
};

export { BeneficiaryPill };
