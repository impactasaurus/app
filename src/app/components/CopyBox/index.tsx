import React from "react";
import { useTranslation } from "react-i18next";
import { ButtonProps, Input } from "semantic-ui-react";

interface IProps {
  text: string;
  loading?: boolean;
}

export const CopyBox = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const linkInput: React.RefObject<Input> = React.createRef();

  const copyLink = () => {
    const node: Input = linkInput.current;
    node.select();
    document.execCommand("copy");
  };

  const action: ButtonProps = {
    primary: true,
    labelPosition: "right",
    icon: "copy",
    content: t("Copy"),
    onClick: copyLink,
  };

  return (
    <Input
      action={action}
      defaultValue={p.text}
      ref={linkInput}
      loading={p.loading}
    />
  );
};
