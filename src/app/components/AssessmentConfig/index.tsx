import * as React from 'react';
import { Button, Select, ButtonProps } from 'semantic-ui-react';
import {DateTimePicker} from 'components/DateTimePicker';
import {Hint} from 'components/Hint';
import {RecordTagInputWithSuggestions} from 'components/RecordTagInputWithSuggestions';
import {BeneficiaryInput} from 'components/BeneficiaryInput';
import {IOutcomeResult, allOutcomeSets} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import {IAssessmentConfig} from 'models/assessment';
import * as moment from 'moment';
import './style.less';
const strings = require('./../../../strings.json');

interface IProps  {
  showDatePicker: boolean;
  buttonText: string;
  onSubmit: (config: IAssessmentConfig) => Promise<void>;
  data?: IOutcomeResult;
}

interface IState {
  startMeetingError?: string;
  selectedOS?: string;
  selectedBenID?: string;
  debouncedBenID?: string;
  conducted?: moment.Moment;
  saving?: boolean;
  tags?: string[];
}

class AssessmentConfigInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      startMeetingError: undefined,
      conducted: moment(),
      saving: false,
      tags: [],
    };
    this.startMeeting = this.startMeeting.bind(this);
    this.setOS = this.setOS.bind(this);
    this.setBenID = this.setBenID.bind(this);
    this.setDebounceBenID = this.setDebounceBenID.bind(this);
    this.clearDebouncedID = this.clearDebouncedID.bind(this);
    this.setConductedDate = this.setConductedDate.bind(this);
    this.renderDatePicker = this.renderDatePicker.bind(this);
    this.setTags = this.setTags.bind(this);
  }

  private validateStartMeetingOptions(beneficiaryID?: string, outcomeSetID?: string): string|null {
    if (!beneficiaryID || beneficiaryID === '') {
      return 'Beneficiary is required';
    }
    if (!outcomeSetID || beneficiaryID === '') {
      return 'Question set must be selected';
    }
    return null;
  }

  private startMeeting() {
    const benID = this.state.selectedBenID;
    const osID = this.state.selectedOS;
    const validation = this.validateStartMeetingOptions(benID, osID);
    if (validation !== null) {
      this.setState({
        startMeetingError: validation,
      });
      return;
    }
    const {conducted, tags} = this.state;
    this.setState({
      saving: true,
    });
    this.props.onSubmit({
      beneficiaryID: benID,
      outcomeSetID: osID,
      date: this.props.showDatePicker ? conducted.toDate() : null,
      tags,
    })
    .catch((e: Error|string)=> {
      this.setState({
        startMeetingError: (e instanceof Error) ? e.message : e,
        saving: false,
      });
    });
  }

  private getOptions(oss: IOutcomeSet[]): any[] {
    if (oss === undefined) {
      return [];
    }
    return oss.map((os) => {
      return {
        key: os.id,
        value: os.id,
        text: os.name,
      };
    });
  }

  private setOS(_, data) {
    this.setState({
      selectedOS: data.value,
    });
  }

  private setBenID(ben: string) {
    this.setState({
      selectedBenID: ben,
    });
  }

  private setDebounceBenID(ben: string) {
    this.setState({
      debouncedBenID: ben,
    });
  }

  private clearDebouncedID() {
    this.setState({
      debouncedBenID: undefined,
    });
  }

  private setConductedDate(date: moment.Moment) {
    this.setState({
      conducted: date,
    });
  }

  private setTags(tags: string[]): void {
    this.setState({
      tags,
    });
  }

  private renderDatePicker(): JSX.Element {
    if (this.props.showDatePicker === false) {
      return (<div />);
    }
    return (
      <div>
        <h3 className="label">Date Conducted</h3>
        <span className="conductedDate">{this.state.conducted.format('llll')}</span>
        <DateTimePicker moment={this.state.conducted} onChange={this.setConductedDate} allowFutureDates={false}/>
      </div>
    );
  }

  public render(): JSX.Element {
    const outcomeSets = this.props.data.allOutcomeSets;
    const startProps: ButtonProps = {};
    if (this.state.saving) {
      startProps.loading = true;
      startProps.disabled = true;
    }
    const selectProps: any = {};
    if (this.props.data.loading) {
      selectProps.loading = true;
      selectProps.disabled = true;
    }
    return (
      <div className="impactform assessment-config">
        <h3 className="label"><Hint text={strings.beneficiaryIDExplanation} />Beneficiary</h3>
        <BeneficiaryInput onChange={this.setBenID} onBlur={this.setDebounceBenID} onFocus={this.clearDebouncedID} allowUnknown={true} />
        <h3 className="label">Questionnaire</h3>
        <Select {...selectProps} placeholder="Questionnaire" onChange={this.setOS} options={this.getOptions(outcomeSets)} />
        <h3 className="label optional"><Hint text={strings.tagExplanation} />Tags</h3>
        <RecordTagInputWithSuggestions
          onChange={this.setTags}
          tags={this.state.tags}
          beneficiary={this.state.debouncedBenID}
        />
        {this.renderDatePicker()}
        <Button {...startProps} className="submit" onClick={this.startMeeting}>{this.props.buttonText}</Button>
        <p>{this.state.startMeetingError}</p>
      </div>
    );
  }
}

const AssessmentConfig = allOutcomeSets<IProps>(AssessmentConfigInner);
export {AssessmentConfig};
