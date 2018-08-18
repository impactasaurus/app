import * as React from 'react';
import {SortableHandle} from 'react-sortable-hoc';
const SolidGrip = require('./grip-vertical-solid.inline.svg');
const Grip = require('./grip-vertical.inline.svg');

interface IProps {
  draggable: boolean;
}

class HandleInner extends React.Component<IProps, any> {
  public render() {
    const style = {
      height:'0.8em',
      color: 'grey',
      paddingLeft: '3px',
      float: 'left',
      marginTop: '10px',
      marginRight: '10px',
    };
    if (!this.props.draggable) {
      return (
        <Grip style={{
          ...style,
          cursor: 'not-allowed',
        }} />
      );
    }
    return (
      <SolidGrip style={{
        ...style,
        cursor: 'move',
      }} />
    );
  }
}

export const Handle = SortableHandle(HandleInner);
