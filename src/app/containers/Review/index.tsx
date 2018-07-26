import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Button, Menu } from 'semantic-ui-react';
import {setURL, IURLConnector} from 'redux/modules/url';
import { bindActionCreators } from 'redux';
import {IStore} from 'redux/IStore';
import {isBeneficiaryUser} from 'redux/modules/user';
import './style.less';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  params: {
      id: string,
  };
  isBeneficiary: boolean;
  child: ReviewPage;
}

export enum ReviewPage {
  JOURNEY,
  RECORDS,
}

@connect((state: IStore) => {
  return {
    isBeneficiary: isBeneficiaryUser(state.user),
    child: state.routing.locationBeforeTransitions.pathname.endsWith('records') ? ReviewPage.RECORDS : ReviewPage.JOURNEY,
  };
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Review extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
    this.renderSubMenu = this.renderSubMenu.bind(this);
    this.innerPageSetter = this.innerPageSetter.bind(this);
  }

  private handleClick(url: string) {
    return () => {
      this.props.setURL(url);
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
      this.handleClick(`/beneficiary/${this.props.params.id}/${subPage}`)();
    };
  }

  private renderSubMenu(): JSX.Element {
    return (
      <Menu pointing={true} secondary={true} className="add-margin">
        <Menu.Item name="Journey" active={this.props.child === ReviewPage.JOURNEY} onClick={this.innerPageSetter(ReviewPage.JOURNEY)}/>
        <Menu.Item name="Records" active={this.props.child === ReviewPage.RECORDS} onClick={this.innerPageSetter(ReviewPage.RECORDS)}/>
      </Menu>
    );
  }

  public render() {
    if(this.props.params.id === undefined) {
      return (<div />);
    }

    let backButton: JSX.Element = (<div />);
    if (this.props.isBeneficiary === false) {
      backButton = (<Button onClick={this.handleClick('/beneficiary')} content="Back" icon="left arrow" labelPosition="left" primary={true} id="back-button"/>);
    }

    return (
      <div>
        <Grid container={true} columns={1}>
          <Grid.Column>
            {backButton}
            <div id="review">
              <Helmet>
                <title>{this.props.params.id + ' Review'}</title>
              </Helmet>
              <h1>{this.props.params.id}</h1>
              {this.renderSubMenu()}
              {this.props.children}
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export { Review };
