import React from "react";
import { ISequence } from "models/sequence";
import { useNavigator } from "redux/modules/url";
import { GenericQuestionnaireListItem } from "components/QuestionnaireList/item";
import { deleteSequence, IDeleteSequence } from "apollo/modules/sequence";

interface IProps {
  sequence: ISequence;
}

const SequenceItemInner = (p: IProps & IDeleteSequence): JSX.Element => {
  const s = p.sequence;
  const setURL = useNavigator();

  const navigate = () => setURL(`/sequences/${s.id}`);

  const onDelete = (): Promise<void> => {
    return p.deleteSequence(p.sequence.id);
  };

  let desc = "";
  if (s.description) {
    desc = s.description + ". ";
  }
  desc += `Questionnaires: ${s.questionnaires.map((q) => q.name).join(", ")}`;
  if (s.destination) {
    try {
      const u = new URL(s.destination);
      desc += `. Destination: ${u.host}`;
    } catch {}
  }

  return (
    <GenericQuestionnaireListItem
      id={s.id}
      name={s.name}
      description={desc}
      onDelete={onDelete}
      onNavigate={navigate}
    />
  );
};

export const SequenceItem = deleteSequence<IProps>(SequenceItemInner);
