import * as React from 'react';

export type ArrayItemRenderer<T> = (T) => JSX.Element;

export function renderArray<T>(fn: ArrayItemRenderer<T>, arr?: T[]): JSX.Element {
  if (Array.isArray(arr)) {
    return (
      <div>
        {arr.map(fn)}
      </div>
    );
  }
  return (<div/>);
}
