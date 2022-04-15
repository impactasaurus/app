import React from "react";
import { SearchResultProps } from "semantic-ui-react";

export const categoryLayoutRenderer = (p: {
  categoryContent: JSX.Element;
  resultsContent: JSX.Element;
}): JSX.Element => (
  <div>
    {p.categoryContent}
    <div className="results">{p.resultsContent}</div>
  </div>
);

export const categoryRenderer = (p: { name: string }): JSX.Element => (
  <h4 className="name">{p.name}</h4>
);

export const resultRenderer = ({
  title,
  description,
}: SearchResultProps): JSX.Element => (
  <div className="content">
    <div className="title">{title}</div>
    <div className="description">{description}</div>
  </div>
);
