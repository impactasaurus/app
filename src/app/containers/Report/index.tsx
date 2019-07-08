import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IURLConnector, setURL} from 'redux/modules/url';
import {Grid, Icon, Menu} from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import {constructReportQueryParams, constructReportURL} from 'helpers/report';
import {SecondaryMenu} from 'components/SecondaryMenu';
import {IReportOptions} from 'containers/Report/helpers';
import {DeltaReport} from 'components/DeltaReport';
import {ServiceReport} from 'components/ServiceReport';
const { connect } = require('react-redux');

export enum SubPage {
  DIST,
  CHANGE,
}

interface IProps extends IURLConnector {
  match: {
    params: {
      questionSetID: string,
      start: string,
      end: string,
      type: string,
    },
  };
  location: {
    search: string,
  };
  child: SubPage;
}

const getQuestionSetIDFromProps = (p: IProps): string => p.match.params.questionSetID;
const getStartDateFromProps = (p: IProps): Date => new Date(p.match.params.start);
const getEndDateFromProps = (p: IProps): Date => new Date(p.match.params.end);
const getTagsFromProps = (p: IProps): string[] => {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('tags') === false) {
    return [];
  }
  const tags = urlParams.get('tags');
  return JSON.parse(tags);
};
const getOpenStartFromProps = (p: IProps): boolean => {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('open') === false) {
    return true;
  }
  return JSON.parse(urlParams.get('open'));
};
const getOrFromProps = (p: IProps): boolean => {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('or') === false) {
    return false;
  }
  return JSON.parse(urlParams.get('or'));
};
const getReportOptionsFromProps = (p: IProps): IReportOptions => {
  return {
    start: getStartDateFromProps(p),
    end: getEndDateFromProps(p),
    questionnaire: getQuestionSetIDFromProps(p),
    openStart: getOpenStartFromProps(p),
    orTags: getOrFromProps(p),
    tags: getTagsFromProps(p),
  };
};

@connect((_: any, p: IProps) => {
  return {
    child: SubPage[p.match.params.type.toUpperCase()] || SubPage.DIST,
  };
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Report extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.innerPageSetter = this.innerPageSetter.bind(this);
  }

  private innerPageSetter(toSet: SubPage): () => void {
    return () => {
      const options = getReportOptionsFromProps(this.props);
      const url = constructReportURL(SubPage[toSet].toLowerCase(), options.start, options.end, options.questionnaire);
      const qs = constructReportQueryParams(options.tags, options.openStart, options.orTags);
      this.props.setURL(url, qs);
    };
  }

  public render() {
    const options = getReportOptionsFromProps(this.props);
    let inner: JSX.Element = <ServiceReport {...options}/>;
    if (this.props.child === SubPage.CHANGE) {
      inner = <DeltaReport {...options}/>;
    }
    return (
      <div>
        <SecondaryMenu signpost={'Impact Report'}>
          <Menu.Item name="DT" active={this.props.child === SubPage.DIST} onClick={this.innerPageSetter(SubPage.DIST)}>
            <Icon name="road" />
            Distance Travelled
          </Menu.Item>
          <Menu.Item name="BC" active={this.props.child === SubPage.CHANGE} onClick={this.innerPageSetter(SubPage.CHANGE)}>
            <Icon name="exchange" />
            Beneficiary Change
          </Menu.Item>
        </SecondaryMenu>
        <Grid container={true} columns={1} id="report-picker">
          <Grid.Column>
            <Helmet>
              <title>Report</title>
            </Helmet>
            {inner}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export {Report};
