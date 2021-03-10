import * as React from 'react';
import {questionnaireURI} from 'helpers/url';
import {CustomError} from 'components/Error';
import {Link} from 'react-router-dom';
import {useTranslation, Trans} from 'react-i18next';

interface IProps {
  questionnaireID: string;
  isBeneficiary: boolean;
}

export const EmptyQuestionnaire = (p: IProps): JSX.Element => {
  const {t} = useTranslation();
  let inner = (
    <span>
      <Trans
        defaults="The questionnaire seems to be empty, <qLink>please try adding some questions</qLink>"
        components={{
          qLink: <Link to={questionnaireURI(p.questionnaireID)} />
        }}
      />
    </span>
  );
  if (p.isBeneficiary) {
    inner = <span>{t("Sorry, this questionnaire is empty. Please contact your facilitator")}</span>;
  }
  return (
    <CustomError inner={inner} />
  );
};
