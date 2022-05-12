import React, { useEffect, useState } from "react";
import { completeMeeting, IMeetingMutation } from "apollo/modules/meetings";
import { useTranslation } from "react-i18next";
import { Loader } from "semantic-ui-react";
import { Error } from "components/Error";

interface IProps extends IMeetingMutation {
  next: () => void;
  benID: string;
  recordID: string;
}

const FinaliseInner = (p: IProps): JSX.Element => {
  const [err, setErr] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    setErr(false);
    p.completeMeeting(p.recordID, p.benID)
      .then(() => {
        p.next();
      })
      .catch((e: Error) => {
        console.error(e);
        setErr(true);
      });
  }, []);

  if (err) {
    return <Error text={t("Failed to finalise record")} />;
  }

  return <Loader active={true} inline="centered" />;
};

export const Finalise = completeMeeting<IProps>(FinaliseInner);
