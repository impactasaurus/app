import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Header, IsLoggedIn } from 'components';
import './style.less';
import './../../theme/typo.less';
import 'semantic-ui-less/semantic.less';
import 'theme/form.less';
import {IStore} from 'redux/IStore';
import { Route, Switch } from 'react-router-dom';
import * as containers from 'containers';
const { connect } = require('react-redux');
const appConfig = require('../../../../config/main');

interface IProps {
  storeLoaded: boolean;
}

@connect((state: IStore): IProps => {
  return {
    storeLoaded: state.storage.loaded,
  };
})
class App extends React.Component<IProps, any> {
  public render() {
    return (
      <section id="impactasaurus">
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        <Header/>
        <IsLoggedIn/>

        <Switch>
          <Route exact={true} path="/" component={containers.Home} />
          <Route path="/record/:type" component={containers.AssessmentConfig} />
          <Route path="/record" component={containers.AssessmentTypeSelect} />
          <Route path="/beneficiary/:id/export/:qid" component={containers.ExportBenRecords} />
          <Route path="/beneficiary/:id" component={containers.Review} />
          <Route path="/beneficiary" component={containers.ReviewSelector} />
          <Route path="/settings" component={containers.Settings} />
          <Route path="/login" component={containers.Login} />
          <Route path="/dataentry/:id" component={containers.DataEntry} />
          <Route path="/meeting/:id/edit" component={containers.RecordEdit} />
          <Route path="/meeting/:id/view" component={containers.RecordView} />
          <Route path="/meeting/:id" component={containers.Meeting} />
          <Route path="/report/service/:questionSetID/:start/:end" component={containers.ServiceReport} />
          <Route path="/report/roc/:questionSetID/:start/:end" component={containers.RateOfChangeReport} />
          <Route path="/report/export/:questionSetID/:start/:end" component={containers.ExportReport} />
          <Route path="/report" component={containers.Report} />
          <Route path="/jti/:jti" component={containers.BeneficiaryRedirect} />
        </Switch>
      </section>
    );
  }
}

export { App };
