import * as React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, Home, Login, Review, Conduct, Settings, OutcomeSets, OutcomeSet, Meeting } from 'containers';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="conduct" component={Conduct} />
    <Route path="review(/:id)" component={Review} />
    <Route path="settings" component={Settings}>
      <Route path="questions" component={OutcomeSets} />
    </Route>
    <Route path="outcomeset" component={OutcomeSets} />
    <Route path="outcomeset/:id" component={OutcomeSet} />
    <Route path="login" component={Login} />
    <Route path="meeting/:id" component={Meeting} />
  </Route>
);
