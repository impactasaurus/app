import * as React from 'react';
import { Card, Button } from 'semantic-ui-react';
import './style.less';

export interface Item {
  title: string;
  subtitle?: string;
  description?: string;
  button?: string;
  onClick: () => void;
}

interface IProps {
  items: Item[];
}

const MultiChoiceItem = (i: Item): JSX.Element => (
  <Card className="choice" key={i.title}>
    <Card.Content>
      <Card.Header>
        {i.title}
      </Card.Header>
      {i.subtitle && (
        <Card.Meta>
          {i.subtitle}
        </Card.Meta>
      )}
      {i.description && (
        <Card.Description>
          {i.description}
        </Card.Description>
      )}
    </Card.Content>
    <Card.Content extra={true}>
      <Button primary={true} onClick={i.onClick}>{i.button || 'Select'}</Button>
    </Card.Content>
  </Card>
);

export const MultiChoice = (p: IProps) => (
  <div style={{paddingTop: '2rem'}}>
    <Card.Group className="multi-choice">
      {p.items.map((i) => MultiChoiceItem(i))}
    </Card.Group>
  </div>
);
