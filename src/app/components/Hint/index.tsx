import * as React from 'react';
import {Icon, Popup, SemanticICONS} from 'semantic-ui-react';
import './style.less';

interface IProps {
  text: string;
  icon?: SemanticICONS;
}

class Hint extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
  }

  public render() {
    const inner = (<Icon className="Hint" name={this.props.icon || 'question circle outline'} />);
    return (
      <Popup
        trigger={inner}
        content={this.props.text}
      />
    );
  }
}

export { Hint };
