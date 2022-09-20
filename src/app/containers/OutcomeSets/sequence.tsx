import React from "react";
import { ISequence } from "models/sequence";
import { useNavigator } from "redux/modules/url";
import { Item } from "./item";

interface IProps {
  sequence: ISequence;
}

const SequenceItemInner = (p: IProps): JSX.Element => {
  const s = p.sequence;
  const setURL = useNavigator();

  const navigate = () => {
    setURL(`/sequences/${s.id}`);
  };

  const onDelete = (): Promise<void> => {
    return Promise.reject(new Error("not implemented"));
  };

  return (
    <Item
      id={s.id}
      name={s.name}
      description={s.description}
      onDelete={onDelete}
      onNavigate={navigate}
    />
  );
};

export const SequenceItem = SequenceItemInner;
