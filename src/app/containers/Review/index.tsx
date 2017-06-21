import * as React from 'react';
const style = require('./style.css');

class Review extends React.Component<any, any> {
  public render() {
    return (
      <div className={style.Home}>
        <p>Show outcome stars to beneficiaries here</p>
        <p>Initially the beneficiary ID would be entered, this will load previous meetings from the database</p>
        <p>A outcome radar graph will be shown, displaying the relative differences between meetings</p>
        <p>Visualisation of meetings can be toggled. Also meetings will be able to be deleted from here</p>
      </div>
    );
  }
}

export { Review }
