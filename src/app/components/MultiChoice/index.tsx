import * as React from 'react';
import { useTranslation } from 'react-i18next';
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

const MultiChoiceItem = ({i}: {i: Item}): JSX.Element => {
  const {t} = useTranslation();
  return (
    <Card className="choice">
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
        <Button primary={true} onClick={i.onClick}>{i.button || t('Select')}</Button>
      </Card.Content>
    </Card>
  );
}

export const MultiChoice = (p: IProps): JSX.Element => (
  <div style={{paddingTop: '2rem'}}>
    <Card.Group className="multi-choice">
      {p.items.map((i) => <MultiChoiceItem key={i.title} i={i} />)}
    </Card.Group>
  </div>
);
