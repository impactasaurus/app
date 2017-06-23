import * as React from 'react';
import {gql, graphql} from 'react-apollo';
const style = require('./style.css');

interface IProps {
  data: any;
  mutate: any;
}

const questionSetQuery = gql`
query allOutcomeSets {
  qs: outcomesets{
    name,
    description,
    id,
    questions {
      id
    }
  }
}`;

const newQuestionSet = gql`
mutation ($name: String!, $description: String) {
  AddOutcomeSet(name:$name, description:$description) {
    name,
    description,
    id,
    questions {
      id
    }
  }
}
`;

class SettingQuestionsInner extends React.Component<IProps, {}> {

  constructor(props) {
    super(props);
    this.createQS = this.createQS.bind(this);
  }

  private createQS() {
    this.props.mutate({
      variables: {
       name: 'wow',
       description: 'this is cool',
      },
    });
  }

  public render() {
    const { data } = this.props;
    return (
      <div className={style.Home}>
        <p>Define question sets here</p>
        <p>An organisation can have multiple questions sets, these will initially been shown in a list here along with a new button</p>
        <p>One hitting new, the user is asked to define a set of likert scale style questions</p>
        <p>Once the first question set has been defined, the organisation can start gathering feedback from beneficiaries</p>
        <p>loading = {data.loading ? 'true' : 'false'}</p>
        <p>qs = {data.qs !== undefined? data.qs.length : ''}</p>
        <div onClick={this.createQS}>
          Click me
        </div>
      </div>
    );
  }
}
const SettingQuestions = graphql(questionSetQuery)(graphql(newQuestionSet, {
  options: {
    refetchQueries: ['allOutcomeSets'],
    /*
    update: (proxy, { data: { AddOutcomeSet } }) => {
      const data = proxy.readQuery({ questionSetQuery });
      data.qs.push(AddOutcomeSet);
      proxy.writeQuery({ questionSetQuery, data });
    },
    */
  } as any,
})(SettingQuestionsInner));
export { SettingQuestions }
