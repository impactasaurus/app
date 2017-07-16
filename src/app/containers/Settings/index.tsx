import * as React from 'react';
import { Link } from 'react-router';

class Settings extends React.Component<any, any> {
  public render() {
    return (
      <div id="settings">
        <ul>
          <li><Link to="/settings/questions">Questions</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

export { Settings }
