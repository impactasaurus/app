import React from "react";
import { useTranslation } from "react-i18next";
import { Message } from "semantic-ui-react";

interface IProps {
  text: string;
}

export const Error = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Message error={true}>
      <Message.Header>{t("Error")}</Message.Header>
      <div>{`${p.text}. ${t(
        "Please refresh and try again, if that doesn't work, please drop us an email at support@impactasaurus.org"
      )}`}</div>
    </Message>
  );
};

export const CustomError = (p: { inner: JSX.Element }): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Message error={true}>
      <Message.Header>{t("Error")}</Message.Header>
      <div>{p.inner}</div>
    </Message>
  );
};
