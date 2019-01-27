import * as React from 'react';
import {Button, ButtonProps, Popup, Icon, SemanticICONS} from 'semantic-ui-react';
import {ICatalogueImport, importQuestionnaire} from '../../apollo/modules/catalogue';
import {IURLConnector, setURL} from '../../redux/modules/url';
import {bindActionCreators} from 'redux';
const { connect } = require('react-redux');

interface IProps extends ICatalogueImport, IURLConnector {
  questionnaireID: string;
  text?: boolean; // defaults true
  options?: ButtonProps;
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
    const options: ButtonProps = {...this.props.options};
    let icon: SemanticICONS = 'add';
    const text = 'Add to your questionnaires';
    let popup = text;
    if (this.state.error) {
      options.color = 'red';
      icon = 'close';
      popup = 'Failed to import';
    } else {
      options.primary = true;
    }
    if (this.props.text) {
      options.children = <span><Icon name={icon} />{text}</span>;
    } else {
      options.icon = icon;
    }
    return (
      <Popup content={popup} trigger={(
        <Button onClick={this.import} loading={this.state.loading} {...options} />
      )} />
    );
  }
}

export const ImportQuestionnaireButton = importQuestionnaire<IProps>(Inner);
