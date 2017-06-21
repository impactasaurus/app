import * as React from 'react';
import { Link } from 'react-router';
const style = require('./style.css');

class Home extends React.Component<any, any> {
  public render() {
    return (
      <div className={style.Home}>
        <ul>
          <li><Link to="settings/questions">1. Create question set</Link></li>
          <li><Link to="conduct">2. Conduct meetings with beneficiary</Link></li>
          <li><Link to="review">3. Review beneficiary's progress</Link></li>
        </ul>
      </div>
    );
  }
}

export { Home }
