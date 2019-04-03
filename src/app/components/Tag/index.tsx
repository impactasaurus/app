import * as React from 'react';
import {Label, Icon} from 'semantic-ui-react';
import {renderArray} from '../../helpers/react';

interface IProps {
  tag: string;
  beneficiary?: boolean;
}

export const Tag = (p: IProps) => (
  <Label className={p.beneficiary ? 'ben' : 'record'} style={{marginTop: '0.2em', marginBottom: '0.2em'}}>
    {p.beneficiary && <Icon name="user"/>}
    <span>{p.tag}</span>
  </Label>
);

interface ISProps {
  benTags: string[];
  recordTags: string[];
}

const tag = (ben: boolean) => (t: string) => <Tag key={t} beneficiary={ben} tag={t}/>;

export const Tags = (p: ISProps) => (
  <>
    {renderArray(tag(true), p.benTags)}{renderArray(tag(false), p.recordTags)}
  </>
);
