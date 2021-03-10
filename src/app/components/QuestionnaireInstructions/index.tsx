import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {Button} from 'semantic-ui-react';
import './style.less';

interface IProps {
  title?: string;
  text: string;
  onNext: () => void;
}

const QuestionnaireInstructions = (p: IProps): JSX.Element => {
  const {t} = useTranslation();
  return (
    <div className="questionnaire-instructions">
      <h1 className="close">{p.title || ''}</h1>
      <h3>{p.text}</h3>
      <Button onClick={p.onNext}>{t("Next")}</Button>
    </div>
  );
}

export {QuestionnaireInstructions};
