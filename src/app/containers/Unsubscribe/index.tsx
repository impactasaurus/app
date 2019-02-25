import * as React from 'react';
import {PageWrapperHoC} from '../../components/PageWrapperHoC';
import {IUnsubscribe, unsubscribe} from '../../apollo/modules/user';
const formFailureGeneric = require('../../../strings.json').formFailureGeneric;
import { Message, Loader } from 'semantic-ui-react';

interface IProps extends IUnsubscribe {
  match: {
    params: {
      uid: string,
    },
  };
}

interface IState {
  error: Error;
  loading: boolean;
}

class UnsubscribeInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      loading: true,
    };
  }

  public componentDidMount() {
    this.props.unsubscribe(this.props.match.params.uid)
      .then(() => {
          this.setState({
            loading: false,
            error: undefined,
          });
      })
      .catch((e) => {
        this.setState({
          loading: false,
          error: e,
        });
      });
  }

  public render() {
    if (this.state.loading) {
      return <Loader active={true} inline="centered" />;
    }
    if (this.state.error) {
      return (
        <Message error={true}>
          <Message.Header>Failed to unsubscribe</Message.Header>
          <Message.Content>{formFailureGeneric}</Message.Content>
        </Message>
      );
    }
    return (
      <Message success={true}>
        <Message.Header>Success</Message.Header>
        <div>You have been unsubscribed</div>
      </Message>
    );
  }
}

export const Unsubscribe = unsubscribe(PageWrapperHoC<IProps>('Unsubscribe', 'unsubscribe', UnsubscribeInner));
