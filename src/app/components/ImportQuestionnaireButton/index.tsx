import * as React from 'react';
import {Button, Popup} from 'semantic-ui-react';
import {ICatalogueImport, importQuestionnaire} from '../../apollo/modules/catalogue';
import {IURLConnector, setURL} from '../../redux/modules/url';
import {bindActionCreators} from 'redux';
const { connect } = require('react-redux');

interface IProps extends ICatalogueImport, IURLConnector {
  questionnaireID: string;
  text?: boolean; // defaults true
}

interface IState {
  loading: boolean;
  error: boolean;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Inner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
    };
    this.import = this.import.bind(this);
  }

  private import() {
    this.setState({
      loading: true,
      error: false,
    });
    this.props.importQuestionnaire(this.props.questionnaireID)
      .then(() => {
        this.props.setURL('/questions');
      })
      .catch(() => {
        this.setState({
          loading: false,
          error: true,
        });
      });
  }

  public render() {
    return (
      <Popup content="Import to your Account" trigger={(
        <Button icon="world" primary={true} onClick={this.import} loading={this.state.loading} />
      )} />
    );
  }
}

export const ImportQuestionnaireButton = importQuestionnaire<IProps>(Inner);
