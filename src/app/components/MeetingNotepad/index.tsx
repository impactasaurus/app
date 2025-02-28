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

const parseNotes = (notes: string) => {
  const existingNotes = notes || "";
  if (existingNotes.indexOf("Feelings:") !== -1) {
    const [textNotes, wordSection] = existingNotes.split("Feelings:");
    return {
      notes: textNotes.trim(),
      words: wordSection
        .trim()
        .split(", ")
        .filter((w) => w),
    };
  }
  return {
    notes: existingNotes,
    words: [],
  };
};

const MeetingNotepadInner = (p: IProps) => {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<boolean>(false);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>(
    () => parseNotes(p.record?.notes).words
  );
  const [notes, setNotes] = useState<string>(
    () => parseNotes(p.record?.notes).notes
  );

  useEffect(() => {
    const { notes: newNotes, words: newWords } = parseNotes(p.record?.notes);
    setNotes(newNotes);
    setSelectedFeelings(newWords);
  }, [p.record]);

  const saveNotes = () => {
    const combinedNotes = `${notes || ""}\n\nFeelings: ${selectedFeelings.join(
      ", "
    )}`;
    const notesNotChanged = p.record.notes === combinedNotes;
    const bothEmpty =
      isNullOrUndefined(p.record.notes) && isNullOrUndefined(combinedNotes);

    if (notesNotChanged || bothEmpty) {
      return p.onComplete();
    }

    setSaving(true);
    setSavingError(false);
    p.setMeetingNotes(p.record.id, combinedNotes)
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
        selectedWords={selectedFeelings}
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
