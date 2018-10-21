import * as React from 'react';
import {FormField} from 'components/FormField';
import {Hint} from 'components/Hint';
import { Form } from 'semantic-ui-react';
import {getCatalogueQuestionnaire, ICatalogueQuestionnaire} from 'apollo/modules/catalogue';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
const strings = require('./../../../strings.json');

interface IProps {
  data: ICatalogueQuestionnaire;
  match: {
    params: {
      id: string,
    },
  };
}

const GeneralReadOnlyForm = (p: IProps) => (
  <Form className="screen">
    <FormField touched={false} inputID="qg-name" required={true} label="Name">
      <span>{p.data.getCatalogueQuestionnaire.name}</span>
    </FormField>
    <FormField touched={false} inputID="qg-description" label="Description">
      <span>{p.data.getCatalogueQuestionnaire.description}</span>
    </FormField>
    <FormField touched={false} inputID="qg-instructions" label={(
      <span><Hint text={strings.instructionsExplanation} />Instructions</span>
    )}>
      <span>{p.data.getCatalogueQuestionnaire.instructions}</span>
    </FormField>
  </Form>
);

const GeneralInner = ApolloLoaderHoC<IProps>('load questionnaire', (p: IProps) => p.data, GeneralReadOnlyForm);

export const General = getCatalogueQuestionnaire<IProps>((props) => props.match.params.id)(GeneralInner);
