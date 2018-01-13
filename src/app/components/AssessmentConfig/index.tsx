import * as React from 'react';
import { Button, Select, Input, ButtonProps, SelectProps } from 'semantic-ui-react';
import {DateTimePicker} from 'components/DateTimePicker';
import {Hint} from 'components/Hint';
import {TagInput} from 'components/TagInput';
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
  conducted?: moment.Moment;
  dateSelectionError?: string;
  saving?: boolean;
  tags: string[];
}

class AssessmentConfigInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      startMeetingError: undefined,
      dateSelectionError: undefined,
      conducted: moment(),
      saving: false,
      tags: [],
    };
    this.startMeeting = this.startMeeting.bind(this);
    this.setOS = this.setOS.bind(this);
    this.setBenID = this.setBenID.bind(this);
    this.setConductedDate = this.setConductedDate.bind(this);
    this.renderDatePicker = this.renderDatePicker.bind(this);
    this.setTags = this.setTags.bind(this);
  }

  private validateStartMeetingOptions(beneficiaryID?: string, outcomeSetID?: string): string|null {
    if (!beneficiaryID || beneficiaryID === '') {
      return 'Beneficiary ID is required';
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
        ...this.state,
        startMeetingError: validation,
      });
      return;
    }
    const conducted = this.state.conducted;
    this.setState({
      ...this.state,
      saving: true,
    });
    this.props.onSubmit({
      beneficiaryID: benID,
      outcomeSetID: osID,
      date: this.props.showDatePicker ? conducted.toDate() : null,
    })
    .catch((e: Error|string)=> {
      this.setState({
        ...this.state,
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
      ...this.state,
      selectedOS: data.value,
    });
  }

  private setBenID(_, data) {
    this.setState({
      ...this.state,
      selectedBenID: data.value,
    });
  }

  private setConductedDate(date: moment.Moment) {
    if (date > moment()) {
      this.setState({
        ...this.state,
        dateSelectionError: 'Conducted date must be in the past',
        conducted: this.state.conducted,
      });
      return;
    }
    this.setState({
      ...this.state,
      conducted: date,
      dateSelectionError: undefined,
    });
  }

  private setTags(tags: string[]): void {
    this.setState({
      tags,
      ...this.state,
    });
  }

  private renderDatePicker(): JSX.Element {
    if (this.props.showDatePicker === false) {
      return (<div />);
    }
    const conductedCopy = this.state.conducted.clone();
    return (
      <div>
        <h3 className="label">Date Conducted</h3>
        <span className="conductedDate">{this.state.conducted.format('llll')}</span>
        <DateTimePicker moment={conductedCopy} onChange={this.setConductedDate}/>
        <p>{this.state.dateSelectionError}</p>
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
    const selectProps: SelectProps = {};
    if (this.props.data.loading) {
      selectProps.loading = true;
      selectProps.disabled = true;
    }
    return (
      <div className="impactform assessment-config">
        <span className="label">
          <Hint text={strings.beneficiaryIDExplanation} />
          <h3 id="benID">Beneficiary ID</h3>
        </span>
        <Input type="text" placeholder="Beneficiary ID" onChange={this.setBenID} />
        <h3 className="label">Questionnaire</h3>
        <Select {...selectProps} placeholder="Questionnaire" onChange={this.setOS} options={this.getOptions(outcomeSets)} />
        <span className="label">
          <Hint text={strings.tagExplanation} />
          <h3 id="tags">Tags</h3>
        </span>
        <TagInput onChange={this.setTags} />
        {this.renderDatePicker()}
        <Button {...startProps} className="submit" onClick={this.startMeeting}>{this.props.buttonText}</Button>
        <p>{this.state.startMeetingError}</p>
      </div>
    );
  }
}

const AssessmentConfig = allOutcomeSets<IProps>(AssessmentConfigInner);
export {AssessmentConfig}
