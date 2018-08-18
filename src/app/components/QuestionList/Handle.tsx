import * as React from 'react';
import {SortableHandle} from 'react-sortable-hoc';
const SolidGrip = require('./grip-vertical-solid.svg');
const Grip = require('./grip-vertical.svg');
import {Image} from 'semantic-ui-react';

interface IProps {
  draggable: boolean;
}

class HandleInner extends React.Component<IProps, any> {
  public render() {
    const style = {
      height: '0.8em',
      paddingLeft: '0.1em',
      marginRight: '0.3em',
    };
    const props = {
      draggable: 'false', // avoid normal HTML5 dragging
    };
    if (!this.props.draggable) {
      return (
        <Image src={Grip} style={{
          ...style,
          cursor: 'not-allowed',
        }} {...props} />
      );
    }
    return (
      <Image src={SolidGrip} style={{
        ...style,
        cursor: 'move',
      }} {...props} />
    );
  }
}

export const Handle = SortableHandle(HandleInner);
