import * as React from "react";
import { Icon, List } from "semantic-ui-react";
import { ConfirmButton } from "components/ConfirmButton";
import { TooltipIcon } from "components/TooltipIcon";
import { useTranslation } from "react-i18next";

interface IProps {
  id: string;
  name: string;
  description: string;
  onDelete: () => Promise<void>;
  onNavigate: () => void;
  readOnly?: boolean; // defaults to false
}

export const Item = (p: IProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <List.Item className="question-set" key={p.id}>
      <List.Content floated="right">
        {p.readOnly !== true && (
          <ConfirmButton
            buttonProps={{ icon: true }}
            promptText={t(
              `Are you sure you want to delete the '{questionnaireName}' questionnaire?`,
              {
                questionnaireName: p.name,
              }
            )}
            onConfirm={p.onDelete}
            tooltip={t("Delete")}
          >
            <Icon name="delete" />
          </ConfirmButton>
        )}
      </List.Content>
      <List.Content onClick={p.onNavigate}>
        <List.Header as="a">
          {p.readOnly === true && (
            <TooltipIcon
              i={{ name: "lock", size: "small" }}
              tooltipContent={t("Read only")}
            />
          )}
          {p.name}
        </List.Header>
        {p.description && (
          <List.Description as="a">{p.description}</List.Description>
        )}
      </List.Content>
    </List.Item>
  );
};
