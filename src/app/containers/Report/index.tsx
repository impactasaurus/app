import * as React from "react";
import { Helmet } from "react-helmet";
import { IURLConnector, setURL } from "redux/modules/url";
import { Grid, Icon, Menu } from "semantic-ui-react";
import { bindActionCreators } from "redux";
import { SecondaryMenu } from "components/SecondaryMenu";
import {
  IUserReportOptions,
  getURLUserReportOptions,
  reportURL,
} from "containers/Report/helpers";
import { DeltaReport } from "components/DeltaReport";
import { ServiceReport } from "components/ServiceReport";
import { StatusReport } from "components/StatusReport";
import { WithTranslation, withTranslation } from "react-i18next";
import { EndOfReportTour } from "components/TourReports";
import { BaselineReport } from "components/BaselineReport";
const { connect } = require("react-redux");

export enum SubPage {
  DIST,
  CHANGE,
  STATUS,
  BASELINE,
}

interface IProps extends IURLConnector, WithTranslation {
  match: {
    params: {
      questionSetID: string;
      start: string;
      end: string;
      type: string;
    };
  };
  location: {
    search: string;
  };
  child: SubPage;
}

const getReportOptionsFromProps = (p: IProps): IUserReportOptions => {
  return getURLUserReportOptions(
    p.match.params,
    new URLSearchParams(p.location.search)
  );
};

@connect(
  (_: unknown, p: IProps) => {
    return {
      child: SubPage[p.match.params.type.toUpperCase()] || SubPage.DIST,
    };
  },
  (dispatch) => ({
    setURL: bindActionCreators(setURL, dispatch),
  })
)
class ReportInner extends React.Component<IProps, null> {
  constructor(props: IProps) {
    super(props);
    this.innerPageSetter = this.innerPageSetter.bind(this);
  }

  private innerPageSetter(toSet: SubPage): () => void {
    return () => {
      const options = getReportOptionsFromProps(this.props);
      const { url, params } = reportURL(SubPage[toSet].toLowerCase(), options);
      this.props.setURL(url, params);
    };
  }

  public render(): JSX.Element {
    const { t, child } = this.props;
    const options = getReportOptionsFromProps(this.props);
    let inner: JSX.Element = <ServiceReport {...options} />;
    if (child === SubPage.CHANGE) {
      inner = <DeltaReport {...options} />;
    }
    if (child === SubPage.STATUS) {
      inner = <StatusReport {...options} />;
    }
    if (child === SubPage.BASELINE) {
      inner = <BaselineReport {...options} />;
    }
    return (
      <div>
        <SecondaryMenu signpost={t("Impact Report")}>
          <Menu.Item
            active={child === SubPage.DIST}
            onClick={this.innerPageSetter(SubPage.DIST)}
          >
            <Icon name="road" />
            {t("Distance Travelled")}
          </Menu.Item>
          <Menu.Item
            active={child === SubPage.CHANGE}
            onClick={this.innerPageSetter(SubPage.CHANGE)}
          >
            <Icon name="exchange" />
            {t("Beneficiary Change")}
          </Menu.Item>
          <Menu.Item
            active={child === SubPage.BASELINE}
            onClick={this.innerPageSetter(SubPage.BASELINE)}
          >
            <Icon name="map pin" />
            {t("Baseline")}
          </Menu.Item>
          <Menu.Item
            active={child === SubPage.STATUS}
            onClick={this.innerPageSetter(SubPage.STATUS)}
          >
            <Icon name="heartbeat" />
            {t("Status")}
          </Menu.Item>
        </SecondaryMenu>
        <Grid container={true} columns={1} id="report-picker">
          <Grid.Column>
            <Helmet>
              <title>{t("Report")}</title>
            </Helmet>
            <EndOfReportTour />
            {inner}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export const Report = withTranslation()(ReportInner);
