import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Icon, Menu } from 'semantic-ui-react';
import {setURL, IURLConnector} from 'redux/modules/url';
import { bindActionCreators } from 'redux';
import {IStore} from 'redux/IStore';
import {isBeneficiaryUser} from 'redux/modules/user';
import './style.less';
import { Switch, Route } from 'react-router-dom';
import * as containers from 'containers';
import {SecondaryMenu} from 'components/SecondaryMenu';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  match: {
    params: {
      id: string,
    },
    path: string,
  };
  isBeneficiary: boolean;
  child: ReviewPage;
}

export enum ReviewPage {
  JOURNEY,
  RECORDS,
}

const getTitle = (b: string, p: ReviewPage) => {
  switch (p) {
    case ReviewPage.RECORDS:
      return `${b}'s Records`;
    case ReviewPage.JOURNEY:
      return `${b}'s Journey`;
    default:
      return b;
  }
};

@connect((state: IStore) => {
  return {
    isBeneficiary: isBeneficiaryUser(state.user),
    child: state.router.location.pathname.endsWith('records') ? ReviewPage.RECORDS : ReviewPage.JOURNEY,
  };
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Review extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
    this.innerPageSetter = this.innerPageSetter.bind(this);
  }

  private handleClick(url: string, search?: string) {
    return () => {
      this.props.setURL(url, search);
    };
  }

  private innerPageSetter(toSet: ReviewPage): () => void {
    return () => {
      let subPage: string;
      switch(toSet) {
        case ReviewPage.JOURNEY: {
          subPage = 'journey';
          break;
        }
        case ReviewPage.RECORDS: {
          subPage = 'records';
          break;
        }
        default: {
          subPage = 'journey';
          break;
        }
      }
      this.handleClick(`/beneficiary/${this.props.match.params.id}/${subPage}`)();
    };
  }

  public render() {
    const ben = this.props.match.params.id;
    if(ben === undefined) {
      return (<div />);
    }

    const match = this.props.match.path;
    const title = getTitle(ben, this.props.child);

    return (
      <div>
        <SecondaryMenu signpost={ben}>
          <Menu.Item name="Journey" active={this.props.child === ReviewPage.JOURNEY} onClick={this.innerPageSetter(ReviewPage.JOURNEY)}>
            <Icon name="chart line" />
            Journey
          </Menu.Item>
          <Menu.Item name="Records" active={this.props.child === ReviewPage.RECORDS} onClick={this.innerPageSetter(ReviewPage.RECORDS)}>
            <Icon name="file outline" />
            Records
          </Menu.Item>
        </SecondaryMenu>
        <Grid container={true} columns={1}>
          <Grid.Column>
            <div id="review">
              <Helmet>
                <title>{title}</title>
              </Helmet>
              <Switch>
                <Route exact={true} path={`${match}/`} component={containers.Journey} />
                <Route path={`${match}/journey`} component={containers.Journey} />
                <Route path={`${match}/records`} component={containers.Records} />
              </Switch>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export { Review };
