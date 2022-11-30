import { sanitiseGraphQLError } from "helpers/apollo";
import React from "react";
import { useState } from "react";
import { Button, Confirm, ButtonProps, Popup } from "semantic-ui-react";

interface IProps {
  promptText: string;
  confirmText?: string;
  cancelText?: string;
  buttonProps?: ButtonProps;
  onConfirm: () => Promise<any>;
  onCancel?: () => void;
  tooltip?: string;
  // By default the loading spinner continues to be shown even after the onConfirm promise is fulfilled.
  // This is good for delete buttons, where the ConfirmButton will be removed from the DOM on success anyways.
  // By default is false.
  stopSpinnerOnCompletion?: boolean;
  children?: React.ReactNode;
}

const ConfirmButton = (props: IProps): JSX.Element => {
  const [show, setShow] = useState<boolean>(false);
  const [doing, setDoing] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);

  const {
    onCancel,
    onConfirm,
    stopSpinnerOnCompletion,
    promptText,
    confirmText,
    cancelText,
  } = props;

  const handleCancel = () => {
    setShow(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    setShow(false);
    setDoing(true);
    setError(null);
    onConfirm?.()
      .then(() => {
        if (stopSpinnerOnCompletion !== true) {
          return;
        }
        setDoing(false);
        setError(null);
      })
      .catch((e: Error) => {
        setDoing(false);
        setError(sanitiseGraphQLError(e.message));
      });
  };

  const tooltip: string | null = error == null ? props.tooltip : error;

  let buttonProps = props.buttonProps || {};
  if (doing) {
    buttonProps = {
      ...buttonProps,
      loading: true,
      disabled: true,
    };
  }
  if (error != null) {
    buttonProps = {
      ...buttonProps,
      negative: true,
    };
  }
  const inner = (
    <span>
      <Button
        onClick={() => {
          setShow(true);
        }}
        {...buttonProps}
      >
        {props.children}
      </Button>
      <Confirm
        open={show}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        content={promptText}
        confirmButton={confirmText}
        cancelButton={cancelText}
      />
    </span>
  );

  if (tooltip !== null) {
    return <Popup trigger={inner} content={tooltip} on={["hover"]} />;
  } else {
    return inner;
  }
};

export { ConfirmButton };
