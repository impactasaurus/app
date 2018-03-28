import * as React from 'react';
import {Icon, SemanticICONS} from 'semantic-ui-react';
import './style.less';

interface IProps {
  text: string;
  title: string;
  icon: SemanticICONS;
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
        <h1>{this.props.title}</h1>
        <h3>{this.props.text}</h3>
      </div>
    );
  }
}

export {FancyBox};
