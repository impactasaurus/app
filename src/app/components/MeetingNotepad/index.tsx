import React, { useState, useEffect } from "react";
import { setMeetingNotes, ISetMeetingNotes } from "apollo/modules/meetings";
import { Button, ButtonProps } from "semantic-ui-react";
import { Notepad } from "components/Notepad";
import { IMeeting } from "models/meeting";
import { Error } from "components/Error";
import { isNullOrUndefined } from "util";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import "rc-slider/assets/index.css";
import "./style.less";
import { FeelingsSelector } from "components/FeelingsSelector";

interface IProps extends ISetMeetingNotes {
  record: IMeeting;
  onBack: () => void;
  onComplete: () => void;
  isNext?: boolean; // defaults to false
}

const FEELINGS_INTRO = "Feelings:";

const parseNotes = (notes: string) => {
  const existingNotes = notes || "";
  if (existingNotes.indexOf(FEELINGS_INTRO) !== -1) {
    const [notes, feelings] = existingNotes.split(FEELINGS_INTRO);
    return {
      notes: notes.trim(),
      feelings: feelings.split(", ").map((w) => w.trim()),
    };
  }
  return {
    notes: existingNotes,
    feelings: [],
  };
};

const MeetingNotepadInner = (p: IProps) => {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<boolean>(false);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>(
    () => parseNotes(p.record?.notes).feelings
  );
  const [notes, setNotes] = useState<string>(
    () => parseNotes(p.record?.notes).notes
  );

  useEffect(() => {
    const { notes: newNotes, feelings: newFeelings } = parseNotes(
      p.record?.notes
    );
    setNotes(newNotes);
    setSelectedFeelings(newFeelings);
  }, [p.record]);

  const saveNotes = () => {
    let toSave = notes || "";
    if (selectedFeelings.length > 0) {
      toSave = `${toSave}\n\n${FEELINGS_INTRO} ${selectedFeelings.join(", ")}`;
    }
    const notesNotChanged = p.record.notes === toSave;
    const bothEmpty =
      isNullOrUndefined(p.record.notes) && isNullOrUndefined(toSave);

    if (notesNotChanged || bothEmpty) {
      return p.onComplete();
    }

    setSaving(true);
    setSavingError(false);
    p.setMeetingNotes(p.record.id, toSave)
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

      <FeelingsSelector
        selectedFeelings={selectedFeelings}
        onChange={setSelectedFeelings}
        outcomeSet={p.record.outcomeSet}
      />

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
