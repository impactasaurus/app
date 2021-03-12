import React, {useState, useEffect} from 'react';
import {Icon, Form, Accordion, TextArea, TextAreaProps} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import './style.less';

interface IProps {
  notes: string | undefined | null;
  onChange: (notes: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  // defaults to true
  collapsible?: boolean;
  disabled?: boolean;
}

const Notepad = (p: IProps): JSX.Element => {

  const [open, setOpen] = useState(p.notes !== undefined && p.notes !== null && p.notes.length > 0);
  useEffect(() => {
    if(!open && p.notes) {
      setOpen(true);
    }
  }, [p.notes]);
  const {t} = useTranslation();

  const onChange = (_: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps): void => {
    if (typeof data.value === 'string') {
      p.onChange(data.value);
    }
  }

  const toggleOpen = () => {
    setOpen(!open);
  }

  const renderTextArea = (): JSX.Element => {
    let placeholder = p.placeholder || t('Record any additional information');
    placeholder = placeholder + '. ' + t("Please ensure the notes do not contain personally identifiable information.");
    const notesNotNull: string | undefined = p.notes ? p.notes : undefined;
    return (
      <Form>
        <TextArea disabled={p.disabled === true} autoHeight={true} placeholder={placeholder} rows={2} onChange={onChange} value={notesNotNull} onBlur={p.onBlur} />
      </Form>
    );
  }

  if (p.collapsible === false) {
    return (
      <div className="notepad">
        {renderTextArea()}
      </div>
    );
  }
  return (
    <Accordion className="notepad">
      <Accordion.Title className="accordion" active={open} index={0} onClick={toggleOpen}>
        <Icon name="dropdown" />
        {t("Notes")}
      </Accordion.Title>
      <Accordion.Content active={open}>
        {renderTextArea()}
      </Accordion.Content>
    </Accordion>
  );
}

export { Notepad };
