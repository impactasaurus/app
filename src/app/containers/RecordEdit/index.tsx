import React from "react";
import {
  Button,
  ButtonProps,
  Input,
  InputOnChangeData,
} from "semantic-ui-react";
import { IURLConnector, UrlHOC } from "redux/modules/url";
import {
  editMeetingDate,
  editMeetingTags,
  editMeetingBeneficiary,
  getMeeting,
  IEditMeetingDate,
  IEditMeetingTags,
  IMeetingResult,
  IEditMeetingBeneficiary,
} from "apollo/modules/meetings";
import { TagInputWithBenSuggestions } from "components/TagInput";
import { Error } from "components/Error";
import { DateTimePicker } from "components/DateTimePicker";
import { Hint } from "components/Hint";
import moment from "moment";
import { Tags } from "components/Tag";
import { PageWrapperHoC } from "components/PageWrapperHoC";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { WithTranslation, withTranslation } from "react-i18next";
import "./style.less";

interface IProps
  extends IURLConnector,
    IEditMeetingDate,
    IEditMeetingTags,
    IEditMeetingBeneficiary,
    WithTranslation {
  match: {
    params: {
      id: string;
    };
  };
  location: {
    // can provide a ?next=relativeURL which the user will be taken to on cancel or successful save
    search: string;
  };
  data: IMeetingResult;
}

interface IState {
  saveError?: string;
  conducted?: moment.Moment;
  recordTags?: string[];
  beneficiary?: string;
  saving?: boolean;
  tagEditing?: boolean;
  dateEditing?: boolean;
  benEditing?: boolean;
  loaded?: boolean;
}

function getNextPageURL(p: IProps): string | undefined {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has("next") === false) {
    return undefined;
  }
  return urlParams.get("next");
}

class RecordEditInner extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {};
    this.saveRecord = this.saveRecord.bind(this);
    this.setTags = this.setTags.bind(this);
    this.setBen = this.setBen.bind(this);
    this.setConductedDate = this.setConductedDate.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.loadState = this.loadState.bind(this);
    this.renderTagSection = this.renderTagSection.bind(this);
    this.renderDateSection = this.renderDateSection.bind(this);
    this.renderBeneficiaryID = this.renderBeneficiaryID.bind(this);
    this.editAnswers = this.editAnswers.bind(this);
  }

  public componentDidMount() {
    if (this.props.data.getMeeting !== undefined) {
      this.loadState(this.props);
    }
  }

  public componentDidReceiveProps(prevProps: IProps) {
    if (
      this.props.data.getMeeting !== undefined &&
      prevProps.data.getMeeting === undefined
    ) {
      this.loadState(this.props);
    }
  }

  private loadState(p: IProps) {
    this.setState({
      conducted: moment(p.data.getMeeting.conducted),
      recordTags: p.data.getMeeting.meetingTags,
      beneficiary: p.data.getMeeting.beneficiary,
      loaded: true,
    });
  }

  private saveRecord() {
    const record = this.props.data.getMeeting;
    const { conducted, recordTags, beneficiary } = this.state;
    this.setState({
      saving: true,
      saveError: undefined,
    });

    let p = Promise.resolve(record);

    if (!this.state.conducted.isSame(record.conducted)) {
      p = p.then(() => {
        return this.props.editMeetingDate(record.id, conducted.toDate());
      });
    }

    const newTags = JSON.stringify(Array.from(recordTags).sort());
    const oldTags = JSON.stringify(Array.from(record.meetingTags).sort());
    if (newTags !== oldTags) {
      p = p.then(() => {
        return this.props.editMeetingTags(record.id, recordTags);
      });
    }

    if (beneficiary !== record.beneficiary) {
      p = p.then(() => {
        return this.props.editMeetingBeneficiary(record.id, beneficiary);
      });
    }

    return p
      .then(() => {
        this.nextPage();
      })
      .catch((e) => {
        console.error(e);
        this.setState({
          saving: false,
          saveError: e,
        });
      });
  }

  private nextPage() {
    const nextPage = getNextPageURL(this.props);
    if (nextPage !== undefined) {
      this.props.setURL(nextPage);
      return;
    }
    this.props.setURL(`/beneficiary/${this.state.beneficiary}`);
  }

  private setConductedDate(date: moment.Moment) {
    this.setState({
      conducted: date,
    });
  }

  private setTags(tags: string[]): void {
    this.setState({
      recordTags: tags,
    });
  }

  private setBen(beneficiary: string): void {
    this.setState({ beneficiary });
  }

  private editAnswers(): void {
    this.props.setURL(`/dataentry/${this.props.match.params.id}`);
  }

  private renderEditButton(onClick: () => void): JSX.Element {
    return (
      <Button
        className="field-edit"
        onClick={onClick}
        compact={true}
        size="tiny"
        primary={true}
      >
        {this.props.t("Edit")}
      </Button>
    );
  }

  private renderBeneficiaryID(benEditing: boolean): JSX.Element {
    let control = <div />;
    if (benEditing) {
      const benChanged = (_, data: InputOnChangeData) => {
        this.setBen(data.value);
      };
      control = (
        <Input
          id="meeting-ben"
          type="text"
          onChange={benChanged}
          value={this.state.beneficiary}
        />
      );
    } else {
      const benEdit = () => {
        this.setState({ benEditing: true });
      };
      const editButton = this.renderEditButton(benEdit);
      control = (
        <span>
          {this.state.beneficiary} {editButton}
        </span>
      );
    }
    return (
      <div>
        <h4 className="label inline">{this.props.t("Beneficiary")}</h4>
        {control}
      </div>
    );
  }

  private renderDateSection(dateEditing: boolean): JSX.Element {
    let control = <div />;
    if (dateEditing) {
      control = (
        <DateTimePicker
          moment={this.state.conducted}
          onChange={this.setConductedDate}
          allowFutureDates={false}
        />
      );
    } else {
      const dateEdit = () => {
        this.setState({ dateEditing: true });
      };
      control = this.renderEditButton(dateEdit);
    }
    return (
      <div>
        <h4 className="label inline">{this.props.t("Date Conducted")}</h4>
        <span className="conductedDate">
          {this.state.conducted.format("llll")}
        </span>
        {control}
      </div>
    );
  }

  private renderTagSection(
    beneficiary: string,
    tagEditing: boolean
  ): JSX.Element {
    const t = this.props.t;
    let tags = <div />;
    if (tagEditing) {
      tags = (
        <div>
          <Tags benTags={this.props.data.getMeeting.benTags} recordTags={[]} />
          <TagInputWithBenSuggestions
            onChange={this.setTags}
            tags={this.state.recordTags}
            id={beneficiary}
          />
        </div>
      );
    } else {
      const tagEdit = () => {
        this.setState({ tagEditing: true });
      };
      const editButton = this.renderEditButton(tagEdit);
      if (this.props.data.getMeeting.tags.length > 0) {
        tags = (
          <div>
            <Tags
              benTags={this.props.data.getMeeting.benTags}
              recordTags={this.state.recordTags}
            />
            {editButton}
          </div>
        );
      } else {
        tags = (
          <span>
            <span>{t("No tags")}</span>
            {editButton}
          </span>
        );
      }
    }
    const tagExplanation = t(
      "Tags are words which can be saved against records. They can be used to filter your records when reporting. Common uses of tags include demographic or intervention information."
    );
    return (
      <div>
        <h4 className="label inline">
          <Hint text={tagExplanation} />
          {t("Tags")}
        </h4>
        {tags}
      </div>
    );
  }

  public render() {
    const record = this.props.data.getMeeting;
    if (
      this.props.match.params.id === undefined ||
      !this.state.loaded ||
      !record
    ) {
      return <div />;
    }

    const startProps: ButtonProps = {};
    if (this.state.saving) {
      startProps.loading = true;
      startProps.disabled = true;
    }

    const t = this.props.t;
    return (
      <div className="impactform">
        {this.renderBeneficiaryID(this.state.benEditing)}
        <div>
          <h4 className="label inline">{t("Questionnaire")}</h4>
          <span>{record.outcomeSet.name}</span>
        </div>
        <div>
          <h4 className="label inline">{t("Facilitator")}</h4>
          <span>{record.user}</span>
        </div>
        {this.renderTagSection(record.beneficiary, this.state.tagEditing)}
        {this.renderDateSection(this.state.dateEditing)}
        <Button
          primary={true}
          onClick={this.editAnswers}
          style={{ marginTop: "1em" }}
        >
          {t("Edit Answers...")}
        </Button>
        <div>
          <div className="button-group">
            <Button className="cancel" onClick={this.nextPage}>
              {t("Cancel")}
            </Button>
            <Button
              {...startProps}
              className="submit"
              onClick={this.saveRecord}
            >
              {t("Save")}
            </Button>
          </div>
          {this.state.saveError && (
            <Error text={t("Failed to save your changes")} />
          )}
        </div>
      </div>
    );
  }
}

// t("record")
const RecordEditLoader = ApolloLoaderHoC<IProps>(
  "record",
  (p: IProps) => p.data,
  RecordEditInner
);
const RecordEditData = editMeetingTags<IProps>(
  editMeetingDate<IProps>(
    editMeetingBeneficiary(
      getMeeting<IProps>((props) => props.match.params.id)(RecordEditLoader)
    )
  )
);
const RecordEditI18n = withTranslation()(RecordEditData);
// t("Edit Record")
const RecordEditPage = PageWrapperHoC(
  "Edit Record",
  "record-edit",
  RecordEditI18n
);
const RecordEdit = UrlHOC(RecordEditPage);
export { RecordEdit };
