import React, { useEffect, useState } from "react";
import { Accordion, Divider, Icon } from "semantic-ui-react";

interface IProps {
  section: string;
  collapsible?: boolean; //defaults to true
  initiallyOpen?: boolean; // defaults to !collapsible
  children: JSX.Element | JSX.Element[];
  explanation?: string;
}

const Explanation = ({ text }: { text: string }) => (
  <p style={{ textAlign: "left", fontStyle: "italic" }}>{text}</p>
);

export const FormSection = ({
  section,
  collapsible = true,
  initiallyOpen = !collapsible,
  children,
  explanation,
}: IProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(initiallyOpen);

  useEffect(() => {
    if (!collapsible && !open) {
      setOpen(true);
    }
  }, [collapsible]);

  const titlePressed = () => {
    if (!collapsible) {
      return;
    }
    setOpen(!open);
  };

  return (
    <Accordion>
      <Accordion.Title
        active={open}
        onClick={titlePressed}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          alignContent: "center",
          padding: 0,
          cursor: collapsible ? "pointer" : "default",
        }}
      >
        {collapsible && <Icon name="dropdown" />}
        <Divider horizontal style={{ flex: 1 }}>
          {section}
        </Divider>
      </Accordion.Title>
      <Accordion.Content
        style={{ padding: 0, paddingBottom: "1em" }}
        active={open}
      >
        {explanation && <Explanation text={explanation} />}
        {children}
      </Accordion.Content>
    </Accordion>
  );
};
