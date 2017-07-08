import * as React from 'react';
import {Icon} from 'semantic-ui-react';
import './style.less';

interface IProps {
  text: string;
  title: string;
  icon: string;
  onClick?: React.ReactEventHandler<any>;
}

class FancyBox extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className="FancyBox" onClick={this.props.onClick}>
        <Icon name={this.props.icon} />
        <h2>{this.props.title}</h2>
        <p>{this.props.text}</p>
      </div>
    );
  }
}

export {FancyBox};
