import * as React from "react";
import { Tick } from "./tick";
import { Link } from "react-router-dom";
import "./item.less";

interface IProps {
  title: string;
  description: string;
  completed: boolean;
  loading: boolean;
  link: string;
  index: number;
  minimal?: boolean; // defaults to false
  onClick?: () => void;
}

export const OnboardingChecklistItem = (p: IProps) => {
  const classname = `onboarding-checklist-item ${
    p.completed === true ? "complete" : "incomplete"
  }`;

  const link = p.onClick ? (
    <a onClick={p.onClick}>{p.title}</a>
  ) : (
    <Link to={p.link}>{p.title}</Link>
  );

  return (
    <div className={classname}>
      <Tick complete={p.completed} loading={p.loading} index={p.index} />
      <div className="content">
        <h3 className="title">{link}</h3>
        {(!p.completed || !p.minimal) && (
          <p className="description">{p.description}</p>
        )}
      </div>
    </div>
  );
};
