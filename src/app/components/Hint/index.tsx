import * as React from 'react';
import {Icon} from 'semantic-ui-react';
import './style.less';

interface IProps {
  text: string;
  icon?: string;
}

class Hint extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <span className="Hint" data-balloon={this.props.text} data-balloon-pos="up" data-balloon-length="large" >
        <Icon name={this.props.icon || 'question circle outline'} />
      </span>
    );
  }
}

export { Hint };
