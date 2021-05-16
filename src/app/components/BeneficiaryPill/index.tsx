import * as React from "react";
import { Label } from "semantic-ui-react";
import { journeyURI } from "helpers/url";

interface IProps {
  beneficiaryID: string;
  // optional, if provided, will show that questionnaire by default when opening the beneficiary's page
  questionnaireID?: string;
}

class BeneficiaryPill extends React.Component<IProps, any> {
  public render() {
    const link = journeyURI(
      this.props.beneficiaryID,
      this.props.questionnaireID
    );
    return (
      <Label as="a" target="_blank" href={link} key={this.props.beneficiaryID}>
        {this.props.beneficiaryID}
      </Label>
    );
  }
}

export { BeneficiaryPill };
