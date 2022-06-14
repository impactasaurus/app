import * as React from "react";
import { Helmet } from "react-helmet";
import {
  IMeetingMutation,
  newMeeting,
  newRemoteMeeting,
} from "apollo/modules/meetings";
import { IURLConnector, UrlHOC } from "redux/modules/url";
import {
  AssessmentType,
  IAssessmentConfig,
  defaultRemoteMeetingLimit,
} from "models/assessment";
import { Grid, Message, Button } from "semantic-ui-react";
import { AssessmentConfig as AssessmentConfigComponent } from "components/AssessmentConfig";
import { QuestionnaireRequired } from "components/QuestionnaireRequired";
import { SummonConfig } from "./summonConfig";
import { generateSummon, IGenerateSummon } from "../../apollo/modules/summon";
import { WithTranslation, withTranslation } from "react-i18next";
import ReactGA from "react-ga";
import * as config from "../../../../config/main";
import { CopyBox } from "components/CopyBox";

const ConfigComponent = QuestionnaireRequired(AssessmentConfigComponent);

interface IProp
  extends IMeetingMutation,
    IURLConnector,
    IGenerateSummon,
    WithTranslation {
  match: {
    params: {
      type: string;
    };
  };
  location: {
    search: string;
  };
}

interface IState {
  link?: string;
  typ: AssessmentType;
}

function getBen(p: IProp): string | undefined {
  const urlParams = new URLSearchParams(p.location.search);
  return urlParams.has("ben") ? urlParams.get("ben") : undefined;
}

class AssessmentConfigInner extends React.Component<IProp, IState> {
  constructor(props: IProp) {
    super(props);
    this.state = {
      typ: AssessmentType[this.props.match.params.type],
    };
    this.shouldGetDate = this.shouldGetDate.bind(this);
    this.startMeeting = this.startMeeting.bind(this);
    this.renderInner = this.renderInner.bind(this);
    this.isUnknownType = this.isUnknownType.bind(this);
    this.getType = this.getType.bind(this);
    this.recordMeetingStarted = this.recordMeetingStarted.bind(this);
    this.setType = this.setType.bind(this);
    this.generateSummon = this.generateSummon.bind(this);
    this.renderLink = this.renderLink.bind(this);
  }

  private getType(): AssessmentType {
    // we duplicate type to state so we can adjust it within the component
    // we do not offer summon type external to this page
    // instead we offer remote, which covers remote and summon types
    return this.state.typ;
  }

  private recordMeetingStarted() {
    ReactGA.event({
      category: "assessment",
      action: "started",
      label: AssessmentType[this.getType()],
    });
  }

  private startMeeting(config: IAssessmentConfig): Promise<void> {
    if (this.getType() === AssessmentType.remote) {
      return this.props
        .newRemoteMeeting(config, defaultRemoteMeetingLimit)
        .then((jti) => {
          this.recordMeetingStarted();
          this.setState({
            link: `jti/${jti}`,
          });
        });
    } else {
      if (this.shouldGetDate() === false) {
        config.date = new Date();
      }
      return this.props.newMeeting(config).then((meeting) => {
        this.recordMeetingStarted();
        if (this.getType() === AssessmentType.historic) {
          this.props.setURL(`/dataentry/${meeting.id}`);
        } else {
          this.props.setURL(`/meeting/${meeting.id}`);
        }
      });
    }
  }

  private generateSummon(qsID: string): Promise<void> {
    return this.props.generateSummon(qsID).then((smn) => {
      this.recordMeetingStarted();
      this.setState({
        link: `smn/${smn}`,
      });
    });
  }

  private shouldGetDate() {
    return this.getType() === AssessmentType.historic;
  }

  private isUnknownType(): boolean {
    return this.getType() === undefined;
  }

  private renderLink(): JSX.Element {
    const { t } = this.props;
    const url = `${config.app.root}/${this.state.link}`;
    return (
      <Message success={true}>
        <Message.Header>{t("Success")}</Message.Header>
        <div>
          {t(
            "Please provide the following link to your {noBeneficiaries, plural, one {beneficiary} other {beneficiaries}}. They have {noDays, plural, one {# day} other {# days}} to complete the questionnaire",
            {
              noBeneficiaries:
                this.getType() === AssessmentType.summon ? 100 : 1,
              noDays: defaultRemoteMeetingLimit,
            }
          )}
        </div>
        <div style={{ marginTop: "1em" }}>
          <CopyBox text={url} />
        </div>
      </Message>
    );
  }

  private setType(type: AssessmentType) {
    return () => {
      this.setState({
        typ: type,
      });
    };
  }

  private renderInner(): JSX.Element {
    const { t } = this.props;
    if (this.isUnknownType()) {
      return (
        <Message error={true}>
          <Message.Header>{t("Error")}</Message.Header>
          <div>{t("Unknown assessment type")}</div>
        </Message>
      );
    }
    if (this.state.link !== undefined) {
      return this.renderLink();
    }
    const showRemoteTypeSelector =
      this.getType() === AssessmentType.remote ||
      this.getType() === AssessmentType.summon;
    const showAssessmentConfig = this.getType() !== AssessmentType.summon;
    const showSummonConfig = this.getType() === AssessmentType.summon;
    const getButtonText = (): string => {
      return this.getType() === AssessmentType.remote ||
        this.getType() === AssessmentType.summon
        ? t("Generate Link")
        : t("Start");
    };
    return (
      <div>
        <div
          key="remote-type-select"
          style={{
            display: showRemoteTypeSelector ? "block" : "none",
            marginBottom: "2em",
          }}
        >
          <Button.Group>
            <Button
              key="remote"
              active={this.getType() === AssessmentType.remote}
              onClick={this.setType(AssessmentType.remote)}
            >
              {t("Single Beneficiary")}
            </Button>
            <Button.Or key="or" text={t<string>("or")} />
            <Button
              key="summon"
              active={this.getType() === AssessmentType.summon}
              onClick={this.setType(AssessmentType.summon)}
            >
              {t("Multiple Beneficiaries")}
            </Button>
          </Button.Group>
        </div>
        <div
          key="assessment-config"
          style={{ display: showAssessmentConfig ? "block" : "none" }}
        >
          <ConfigComponent
            defaultBen={getBen(this.props)}
            showDatePicker={this.shouldGetDate()}
            onSubmit={this.startMeeting}
            buttonText={getButtonText()}
          />
        </div>
        <div
          key="summon-config"
          style={{ display: showSummonConfig ? "block" : "none" }}
        >
          <Message info={true}>
            <p>
              {t(
                "Beneficiaries will be asked for their beneficiary ID before they answer the questionnaire. When sending the link, ensure that your beneficiaries know what ID they should be using."
              )}
            </p>
            <p>
              {t(
                "As beneficiary IDs are provided by the recipient of the link, there is potential for abuse. If your beneficiaries know each others IDs, they could answer the questionnaire pretending to be another beneficiary. In this case, you should use single beneficiary links instead."
              )}
            </p>
          </Message>
          <SummonConfig
            buttonText={getButtonText()}
            onSubmit={this.generateSummon}
          />
        </div>
      </div>
    );
  }

  public render() {
    const { t } = this.props;
    const getTitle = (): string => {
      return this.getType() === AssessmentType.summon ||
        this.getType() === AssessmentType.remote
        ? t("New Link")
        : t("New Record");
    };
    return (
      <Grid container={true} columns={1} id="assessment-config">
        <Grid.Column>
          <Helmet title={getTitle()} />
          <h1>{getTitle()}</h1>
          {this.renderInner()}
        </Grid.Column>
      </Grid>
    );
  }
}

const AssessmentConfigConnected = UrlHOC(AssessmentConfigInner);
const AssessmentConfigTranslated = withTranslation()(AssessmentConfigConnected);
const AssessmentConfig = newRemoteMeeting<IProp>(
  newMeeting<IProp>(generateSummon<IProp>(AssessmentConfigTranslated))
);
export { AssessmentConfig };
