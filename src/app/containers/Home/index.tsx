import * as React from 'react';
import { Link } from 'react-router';
import { FancyBox } from 'components/FancyBox';
const style = require('./style.css');

class Home extends React.Component<any, any> {
  public render() {
    return (
      <div className={style.Home}>
        <ul>
          <li><Link to="settings/questions"><FancyBox text="Define the questions you would like to ask your beneificaries" title="Define" icon="edit" /></Link></li>
          <li><Link to="conduct">2. Conduct meetings with beneficiary</Link></li>
          <li><Link to="review">3. Review beneficiary's progress</Link></li>
        </ul>
      </div>
    );
  }
}

export { Home }
