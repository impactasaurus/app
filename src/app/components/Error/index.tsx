import * as React from 'react';
import {Message} from 'semantic-ui-react';
const failureMessage = require('../../../strings.json').failureGeneric;

interface IProps {
  text: string;
}

export const Error = (p: IProps) => (
  <Message error={true}>
    <Message.Header>Error</Message.Header>
    <div>{`${p.text}. ${failureMessage}`}</div>
  </Message>
);
