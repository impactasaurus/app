import * as React from "react";
import { useNavigator } from "redux/modules/url";
import cx from "classnames";
import "./item.less";

interface IProps {
  icon: JSX.Element;
  title?: string;
  link: string;
  active: boolean;
  id?: string;
}

export const MenuItem = (p: IProps): JSX.Element => {
  const setURL = useNavigator();
  const cls = cx({
    item: true,
    button: true,
    active: p.active,
  });
  return (
    <div id={p.id} className={cls} onClick={() => setURL(p.link)}>
      {p.icon}
    </div>
  );
};
