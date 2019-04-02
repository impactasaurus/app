import * as React from 'react';
import {Label, Icon} from 'semantic-ui-react';

interface IProps {
  tag: string;
  beneficiary?: boolean;
}

export const Tag = (p: IProps) => (
  <Label className={p.beneficiary ? 'ben' : 'record'}>
    {p.beneficiary && <Icon name="user"/>}
    <span>{p.tag}</span>
  </Label>
);
