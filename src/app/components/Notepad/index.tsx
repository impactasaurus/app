import React, { useEffect, useState } from "react";
import {
  Accordion,
  Form,
  Icon,
  TextArea,
  TextAreaProps,
} from "semantic-ui-react";
import { useTranslation } from "react-i18next";

interface IProps {
  notes: string | undefined | null;
  onChange: (notes: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean; // defaults to false
  prompt?: string | boolean; // false = turns off, undefined = default text, string = override text
  collapsible?: boolean;
}

const RequiredStar = () => (
  <span
    style={{
      color: "red",
      fontSize: "1.3em",
      margin: "-0.05em 0em 0em 0.05em",
    }}
  >
    *
  </span>
);

const NotepadInner = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const onChange = (
    _: React.FormEvent<HTMLTextAreaElement>,
    data: TextAreaProps
  ): void => {
    if (typeof data.value === "string") {
      p.onChange(data.value);
    }
  };

  const notesNotNull: string | undefined = p.notes ? p.notes : undefined;
  return (
    <div className="notepad">
      {p.prompt !== false && (
        <div
          style={{
            textAlign: "left",
            paddingTop: "1em",
            paddingBottom: "0.5em",
          }}
        >
          {p.prompt || t("Additional information")}
          {p.required && <RequiredStar />}:
        </div>
      )}
      <div>
        <Form>
          <TextArea
            disabled={p.disabled === true}
            autoHeight={true}
            rows={2}
            onChange={onChange}
            value={notesNotNull}
            onBlur={p.onBlur}
            placeholder={p.placeholder}
            style={{ minHeight: "5em" }}
          />
        </Form>
      </div>
    </div>
  );
};

const CollapsibleNotepad = (p: IProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const notesSet = p.notes && p.notes.length > 0;
    if (!open && (notesSet || p.required)) {
      setOpen(true);
    }
  }, [p.notes, p.required]);
  const toggleOpen = () => setOpen(!open);
  return (
    <Accordion className="accordion">
      <Accordion.Title
        active={open}
        index={0}
        onClick={toggleOpen}
        style={{ textAlign: "left" }}
      >
        <Icon name="dropdown" />
        {p.prompt || t("Additional information")}
        {p.required && <RequiredStar />}
      </Accordion.Title>
      <Accordion.Content active={open}>
        <NotepadInner {...p} prompt={false} />
      </Accordion.Content>
    </Accordion>
  );
};

const Notepad = (p: IProps): JSX.Element =>
  p.collapsible ? <CollapsibleNotepad {...p} /> : <NotepadInner {...p} />;
export { Notepad };
