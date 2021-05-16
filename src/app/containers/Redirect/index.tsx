import * as React from "react";
import { bindActionCreators } from "redux";
import { IURLConnector, setURL } from "../../redux/modules/url";
const { connect } = require("react-redux");
import { Loader } from "semantic-ui-react";

interface IProps extends IURLConnector {
  location: {
    search: string;
  };
}

const getRedirectURL = (p: IProps): string | undefined => {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has("redirect") === false) {
    return undefined;
  }
  return urlParams.get("redirect");
};

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
export class Redirect extends React.Component<IProps, any> {
  public componentDidMount() {
    let redirect = getRedirectURL(this.props);
    if (redirect === undefined) {
      redirect = "/";
    }
    this.props.setURL(redirect);
  }

  public render() {
    return <Loader active={true} inline="centered" />;
  }
}
