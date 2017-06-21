import * as React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, Home, Login, Review, Conduct, Settings, SettingQuestions } from 'containers';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="conduct" component={Conduct} />
    <Route path="review" component={Review} />
    <Route path="settings" component={Settings}>
      <Route path="questions" component={SettingQuestions} />
    </Route>
    <Route path="login" component={Login} />
  </Route>
);
