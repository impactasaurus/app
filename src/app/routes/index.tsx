import * as React from 'react';
import { IndexRoute, Route } from 'react-router';
import * as containers from 'containers';

export default (
  <Route path="/" component={containers.App}>
    <IndexRoute component={containers.Home} />
    <Route path="record" component={containers.AssessmentTypeSelect} />
    <Route path="record/:type" component={containers.AssessmentConfig} />
    <Route path="beneficiary" component={containers.ReviewSelector} />
    <Route path="beneficiary/:id" component={containers.Review}>
      <IndexRoute component={containers.Journey}/>
      <Route path="journey" component={containers.Journey} />
      <Route path="records" component={containers.Records} />
    </Route>
    <Route path="settings" component={containers.Settings}>
      <Route path="account" component={containers.Account} />
      <Route path="data/questionnaire/export/:id" component={containers.ExportQuestionnaire} />
      <Route path="data" component={containers.Data} />
      <Route path="organisation" component={containers.Organisation} />
      <Route path="questions" component={containers.OutcomeSets} />
      <Route path="questions/:id" component={containers.OutcomeSet} />
    </Route>
    <Route path="login" component={containers.Login} />
    <Route path="dataentry/:id" component={containers.DataEntry} />
    <Route path="meeting/:id" component={containers.Meeting} />
    <Route path="meeting/:id/edit" component={containers.RecordEdit} />
    <Route path="meeting/:id/view" component={containers.RecordView} />
    <Route path="report" component={containers.Report} />
    <Route path="report/service/:questionSetID/:start/:end" component={containers.ServiceReport} />
    <Route path="report/roc/:questionSetID/:start/:end" component={containers.RateOfChangeReport} />
    <Route path ="jti/:jti" component={containers.BeneficiaryRedirect} />
  </Route>
);
