import * as React from 'react';
import {Label, Icon, SemanticICONS, Popup} from 'semantic-ui-react';
import {renderArray} from '../../helpers/react';

interface IProps {
  tag: string;
  beneficiary?: boolean;
  icon?: SemanticICONS;
  onClick?: () => void;
}

export const Tag = (p: IProps) => (
  <Label
    as={p.onClick ? 'a' : undefined}
    key={p.tag}
    className={p.beneficiary ? 'ben' : 'record'}
    onClick={p.onClick}
    style={{marginTop: '0.2em', marginBottom: '0.2em'}}
  >
    {p.beneficiary && <Popup trigger={<Icon name="user"/>} content="Beneficiary Tag" />}
    <span>{p.tag}</span>
    {p.icon !== undefined && <Icon name={p.icon} />}
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
