import React, { useState } from "react";
import useInterval from "helpers/hooks/useInterval";
import { useTranslation } from "react-i18next";
import { Button, ButtonProps, Icon, Input } from "semantic-ui-react";
import { QRCodeCanvas } from "qrcode.react";
import { TooltipButton } from "components/TooltipButton";
import { saveAs } from "file-saver";

interface IProps {
  text: string;
  qrcode?: boolean; // defaults to true
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

  const downloadQR = () => {
    const canvas = document.querySelector<HTMLCanvasElement>(
      ".cb-qrcode > canvas"
    );
    saveAs(canvas.toDataURL(), "Impactasaurus-QR.png");
  };

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
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "600px", flexGrow: 1 }}>
        <Input
          className="copy-box"
          defaultValue={p.text}
          ref={linkInput}
          iconPosition="left"
          fluid={true}
          action={true}
        >
          <Icon name="linkify" />
          <input />
          <Button {...action} />
          {p.qrcode !== false && (
            <TooltipButton
              buttonProps={{ icon: "qrcode", onClick: downloadQR }}
              tooltipContent={t("QR Code")}
            />
          )}
        </Input>
      </div>
      <div style={{ display: "none" }} className="cb-qrcode">
        <QRCodeCanvas
          value={p.text}
          size={1024}
          includeMargin={true}
          level="L"
        />
      </div>
    </div>
  );
};
