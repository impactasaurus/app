import React, { useState } from "react";
import useInterval from "helpers/hooks/useInterval";
import { useTranslation } from "react-i18next";
import { ButtonProps, Input } from "semantic-ui-react";

interface IProps {
  text: string;
  loading?: boolean;
}

const showCopiedLabelDuration = 4000;

export const CopyBox = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  const [copiedTime, setCopiedTime] = useState<number>(0);
  const linkInput: React.RefObject<Input> = React.createRef();

  useInterval(() => {
    if (copiedTime !== 0 && Date.now() - copiedTime > showCopiedLabelDuration) {
      // force refresh
      setCopiedTime(0);
    }
  }, 200);

  const copyLink = () => {
    const node: Input = linkInput.current;
    node.select();
    document.execCommand("copy");
    setCopiedTime(Date.now());
  };

  const copied = Date.now() - copiedTime < showCopiedLabelDuration;
  const action: ButtonProps = {
    primary: true,
    labelPosition: "right",
    icon: copied ? "check" : "copy",
    content: copied ? t("Copied") : t("Copy"),
    onClick: copyLink,
  };

  return (
    <Input
      className="copy-box"
      action={action}
      defaultValue={p.text}
      ref={linkInput}
      loading={p.loading}
    />
  );
};
