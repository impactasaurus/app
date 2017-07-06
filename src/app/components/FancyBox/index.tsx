import * as React from 'react';
import {Icon} from 'semantic-ui-react';
const style = require('./style.css');

interface IProps {
  text: string;
  title: string;
  icon: string;
}

class FancyBox extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={style.Wrapper}>
        <Icon name={this.props.icon} />
        <span className={style.Title}>{this.props.title}</span>
        <p className={style.Text}>{this.props.text}</p>
      </div>
    );
  }
}

export {FancyBox};
