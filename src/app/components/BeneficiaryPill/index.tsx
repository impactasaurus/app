import * as React from 'react';
import {Label} from 'semantic-ui-react';

interface IProps {
  beneficiaryID: string;
  // optional, if provided, will show that questionnaire by default when opening the beneficiary's page
  questionnaireID?: string;
}

class BeneficiaryPill extends React.Component<IProps, any> {
  public render() {
    const b = this.props.beneficiaryID;
    let link = `/beneficiary/${b}`;
    if (this.props.questionnaireID !== undefined && this.props.questionnaireID !== null) {
      link = `${link}?q=${this.props.questionnaireID}`;
    }
    return (
      <Label as="a" target="_blank" href={link} key={b}>{b}</Label>
    );
  }
}

export {BeneficiaryPill};
