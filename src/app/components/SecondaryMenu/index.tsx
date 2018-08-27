import * as React from 'react';
import {Menu} from 'semantic-ui-react';

interface IProps {
  signpost?: string;
}

// Secondary Menu is a wrapper around Semantic UI's menu
export class SecondaryMenu extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
  }

  public render() {
    const p = {
      ...this.props,
      pointing: true,
      secondary: true,
    };
    return (
      <Menu {...p}>
        {this.props.children}
      </Menu>
    );
  }
}
