import * as React from "react";
import { Menu } from "semantic-ui-react";
import "./style.less";

interface IProps {
  signpost?: string | JSX.Element;
}

// Secondary Menu is a wrapper around Semantic UI's menu
export class SecondaryMenu extends React.Component<IProps, any> {
  constructor(props) {
    super(props);
  }

  private renderTopSecondary() {
    const p = {
      pointing: true,
      secondary: true,
    };
    return <Menu {...p}>{this.props.children}</Menu>;
  }

  private renderSignpostSecondary() {
    const p = {
      pointing: true,
      secondary: true,
    };
    return (
      <div className="signpost">
        <h1 className="close">{this.props.signpost}</h1>
        <Menu {...p}>{this.props.children}</Menu>
      </div>
    );
  }

  public render() {
    if (this.props.signpost) {
      return this.renderSignpostSecondary();
    }
    return this.renderTopSecondary();
  }
}
