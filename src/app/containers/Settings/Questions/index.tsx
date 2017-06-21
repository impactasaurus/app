import * as React from 'react';
const style = require('./style.css');

class SettingQuestions extends React.Component<any, any> {
  public render() {
    return (
      <div className={style.Home}>
        <p>Define question sets here</p>
        <p>An organisation can have multiple questions sets, these will initially been shown in a list here along with a new button</p>
        <p>One hitting new, the user is asked to define a set of likert scale style questions</p>
        <p>Once the first question set has been defined, the organisation can start gathering feedback from beneficiaries</p>
      </div>
    );
  }
}

export { SettingQuestions }
