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
      <span>{p.data.getCatalogueQuestionnaire.outcomeset.name}</span>
    </FormField>
    <FormField touched={false} inputID="qg-description" label="Description">
      <span>{p.data.getCatalogueQuestionnaire.outcomeset.description}</span>
    </FormField>
    <FormField touched={false} inputID="qg-license" label="License">
      <span>{p.data.getCatalogueQuestionnaire.license}</span>
    </FormField>
    {p.data.getCatalogueQuestionnaire.attribution && (
      <FormField touched={false} inputID="qg-attr" label="Attribution">
        <span>{p.data.getCatalogueQuestionnaire.attribution}</span>
      </FormField>
    )}
    <FormField touched={false} inputID="qg-instructions" label={(
      <span><Hint text={strings.instructionsExplanation} />Instructions</span>
    )}>
      <span>{p.data.getCatalogueQuestionnaire.outcomeset.instructions}</span>
    </FormField>
  </Form>
);

const GeneralInner = ApolloLoaderHoC<IProps>('questionnaire', (p: IProps) => p.data, GeneralReadOnlyForm);

export const General = getCatalogueQuestionnaire<IProps>((props) => props.match.params.id)(GeneralInner);
