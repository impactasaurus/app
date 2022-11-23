import React, { useState, useEffect } from "react";
import { setMeetingNotes, ISetMeetingNotes } from "apollo/modules/meetings";
import { Button, ButtonProps } from "semantic-ui-react";
import { Notepad } from "components/Notepad";
import { IMeeting } from "models/meeting";
import { Error } from "components/Error";
import { isNullOrUndefined } from "util";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import "rc-slider/assets/index.css";
import "./style.less";

interface IProps extends ISetMeetingNotes {
  record: IMeeting;
  onBack: () => void;
  onComplete: () => void;
  isNext?: boolean; // defaults to false
}

const MeetingNotepadInner = (p: IProps) => {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<boolean>(false);
  const [notes, setNotes] = useState((p.record || {}).notes);
  useEffect(() => {
    setNotes((p.record || {}).notes);
  }, [p.record]);

  const saveNotes = () => {
    const notesNotChanged = p.record.notes === notes;
    const bothEmpty =
      isNullOrUndefined(p.record.notes) && isNullOrUndefined(notes);
    if (notesNotChanged || bothEmpty) {
      return p.onComplete();
    }
    setSaving(true);
    setSavingError(false);
    p.setMeetingNotes(p.record.id, notes)
      .then(() => {
        ReactGA.event({
          category: "assessment",
          label: "notes",
          action: "provided",
        });
        p.onComplete();
      })
      .catch((e) => {
        console.error(e);
        setSaving(false);
        setSavingError(true);
      });
  };

  const placeholder = t("Record any additional comments, goals or actions");
  const nextProps: ButtonProps = {};
  if ((notes || "").length === 0 && p.record.outcomeSet?.noteRequired) {
    nextProps.disabled = true;
  }
  if (saving) {
    nextProps.loading = true;
    nextProps.disabled = true;
  }
  return (
    <div className="meeting-notepad">
      <h1>{t("Additional Comments")}</h1>
      <Notepad
        onChange={setNotes}
        notes={notes}
        prompt={p.record.outcomeSet?.notePrompt || placeholder}
        required={p.record.outcomeSet?.noteRequired}
      />
      <Button onClick={p.onBack}>{t("Back")}</Button>
      <Button {...nextProps} onClick={saveNotes}>
        {p.isNext === true ? t("Next") : t("Finish")}
      </Button>
      {savingError && <Error text={t("Failed to save notes")} />}
    </div>
  );
};
const MeetingNotepad = setMeetingNotes<IProps>(MeetingNotepadInner);
export { MeetingNotepad };
