import * as React from 'react';
import { Link } from 'react-router';
const style = require('./style.css');

class Settings extends React.Component<any, any> {
  public render() {
    return (
      <div className={style.Home}>
        <ul>
          <li><Link to="/settings/questions">Questions</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

export { Settings }
