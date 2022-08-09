import * as React from "react";
import { Icon, Popup, SemanticICONS } from "semantic-ui-react";
import "./style.less";

interface IProps {
  text: string;
  icon?: SemanticICONS;
}

const Hint = (props: IProps): JSX.Element => {
  const { icon, text } = props;

  const inner = (
    <Icon className="Hint" name={icon || "question circle outline"} />
  );
  return <Popup trigger={inner} content={text} />;
};

export { Hint };
