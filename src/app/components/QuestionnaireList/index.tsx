import React from "react";
import { TooltipButton } from "components/TooltipButton";
import { renderArray } from "helpers/react";
import { Button, List, Responsive } from "semantic-ui-react";
import "./style.less";

interface IProps<T> {
  renderItem: (i: T) => JSX.Element;
  newClicked: () => void;
  text: {
    title: string;
    newButton: string;
  };
  items: T[];
  newButtonID?: string;
  beforeList?: JSX.Element;
  emptyList?: JSX.Element;
  afterList?: JSX.Element;
}

export const GenericQuestionnaireList: <T>(p: IProps<T>) => JSX.Element = (
  p
) => {
  return (
    <div id="generic-questionnaire-list">
      <span className="title-holder">
        <Responsive
          as={Button}
          minWidth={1200}
          icon="plus"
          content={p.text.newButton}
          primary={true}
          onClick={p.newClicked}
          id={p.newButtonID}
        />
        <Responsive
          as={TooltipButton}
          maxWidth={1199}
          buttonProps={{
            icon: "plus",
            primary: true,
            onClick: p.newClicked,
          }}
          tooltipContent={p.text.newButton}
          id={p.newButtonID}
        />
      </span>
      <h1 key="title">{p.text.title}</h1>
      {p.beforeList && p.beforeList}
      <List
        divided={true}
        relaxed={true}
        verticalAlign="middle"
        className="list"
      >
        {renderArray(p.renderItem, p.items || [], p.emptyList)}
      </List>
      {p.afterList && p.afterList}
    </div>
  );
};
