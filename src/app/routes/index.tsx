import * as React from 'react';
import { IndexRoute, Route } from 'react-router';
import * as containers from 'containers';

export default (
  <Route path="/" component={containers.App}>
    <IndexRoute component={containers.Home} />
    <Route path="record" component={containers.AssessmentTypeSelect} />
    <Route path="record/:type" component={containers.AssessmentConfig} />
    <Route path="review" component={containers.ReviewSelector} />
    <Route path="review/:id" component={containers.Review} />
    <Route path="settings" component={containers.Settings}>
      <Route path="account" component={containers.Account} />
      <Route path="organisation" component={containers.Organisation} />
      <Route path="questions" component={containers.OutcomeSets} />
      <Route path="questions/:id" component={containers.OutcomeSet} />
    </Route>
    <Route path="login" component={containers.Login} />
    <Route path="meeting/:id" component={containers.Meeting} />
    <Route path="report" component={containers.Report} />
    <Route path="report/service/:questionSetID/:start/:end" component={containers.ServiceReport} />
    <Route path="report/roc/:questionSetID/:start/:end" component={containers.RateOfChangeReport} />
    <Route path ="jti/:jti" component={containers.BeneficiaryRedirect} />
  </Route>
);
