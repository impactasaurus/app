import * as React from 'react';
const style = require('./style.css');

class Conduct extends React.Component<any, any> {
  public render() {
    return (
      <div className={style.Home}>
        <p>Conduct meetings with beneficiaries here</p>
        <p>Initially capture: Beneficiary ID, question set to use and time meeting was conducted</p>
        <p>Then show questions from question set, recording each response from the beneficiary</p>
      </div>
    );
  }
}

export { Conduct }
