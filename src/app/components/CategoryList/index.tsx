import React, { useState } from "react";
import { ICategoryMutation, deleteCategory } from "apollo/modules/categories";
import { renderArray } from "helpers/react";
import { ICategory } from "models/category";
import { IOutcomeSet } from "models/outcomeSet";
import { List, Loader, Button, Popup, Message } from "semantic-ui-react";
import { NewQuestionCategory } from "components/NewQuestionCategory";
import { EditQuestionCategory } from "components/EditQuestionCategory";
import { ConfirmButton } from "components/ConfirmButton";
import { useTranslation } from "react-i18next";

interface IProps extends ICategoryMutation {
  outcomeSetID: string;
  questionnaire: IOutcomeSet;
  readOnly?: boolean; // defaults to false
}

const editable = (p: IProps) => p.readOnly !== true;

const WrapCategoryForm = (p: {
  title: string;
  children: JSX.Element;
}): JSX.Element => (
  <Message className="form-container">
    <Message.Header>{p.title}</Message.Header>
    <Message.Content>{p.children}</Message.Content>
  </Message>
);

const CategoryListInner = (p: IProps) => {
  const [editedCategoryId, setEditedCategoryIdInner] = useState(undefined);
  const [newCategoryClicked, setNewCategoryClickedInner] = useState(false);
  const { t } = useTranslation();

  const deleteCategory = (categoryID: string) => {
    return (): Promise<IOutcomeSet> => {
      return p.deleteCategory(p.outcomeSetID, categoryID).catch((e: Error) => {
        if (e.message.indexOf("being used") !== -1) {
          throw Error("Cannot delete a category which is in use");
        }
        throw e;
      });
    };
  };

  const setNewCategoryClicked = (newValue: boolean): (() => void) => {
    return () => {
      setEditedCategoryIdInner(undefined);
      setNewCategoryClickedInner(newValue);
    };
  };

  const setEditedCategoryId = (categoryId: string): (() => void) => {
    return () => {
      setEditedCategoryIdInner(categoryId);
      setNewCategoryClickedInner(false);
    };
  };

  const renderCategory = (c: ICategory): JSX.Element => {
    if (editedCategoryId && editedCategoryId === c.id) {
      return (
        <List.Item className="edit-control" key={c.id}>
          <List.Content>
            <WrapCategoryForm title={t("Edit Category")}>
              <EditQuestionCategory
                category={c}
                QuestionSetID={p.outcomeSetID}
                OnSuccess={setEditedCategoryId(null)}
                OnCancel={setEditedCategoryId(null)}
              />
            </WrapCategoryForm>
          </List.Content>
        </List.Item>
      );
    }

    const editButton = (
      <span>
        <Button
          onClick={setEditedCategoryId(c.id)}
          icon="edit"
          tooltip={t("Edit")}
          compact={true}
          size="tiny"
        />
      </span>
    );

    return (
      <List.Item className="category" key={c.id}>
        {editable(p) && (
          <List.Content floated="right" verticalAlign="middle">
            <Popup trigger={editButton} content={t("Edit")} />
            <ConfirmButton
              onConfirm={deleteCategory(c.id)}
              promptText={t("Are you sure you want to delete this category?")}
              buttonProps={{ icon: "delete", compact: true, size: "tiny" }}
              tooltip={t("Delete")}
              confirmText={t("Delete")}
              cancelText={t("Cancel")}
            />
          </List.Content>
        )}
        <List.Content verticalAlign="middle">
          <List.Header>{c.name}</List.Header>
          <List.Description>{c.description}</List.Description>
        </List.Content>
      </List.Item>
    );
  };

  const renderNewCategoryControl = (): JSX.Element => {
    if (newCategoryClicked === true) {
      return (
        <List.Item className="new-control">
          <List.Content>
            <WrapCategoryForm title={t("Add Category")}>
              <NewQuestionCategory
                QuestionSetID={p.outcomeSetID}
                OnSuccess={setNewCategoryClicked(false)}
                OnCancel={setNewCategoryClicked(false)}
              />
            </WrapCategoryForm>
          </List.Content>
        </List.Item>
      );
    } else {
      return (
        <List.Item className="new-button">
          <List.Content style={{ textAlign: "center", marginTop: "1em" }}>
            <Button
              icon="plus"
              content={t("Add Category")}
              primary={true}
              onClick={setNewCategoryClicked(true)}
            />
          </List.Content>
        </List.Item>
      );
    }
  };

  if (!p.questionnaire) {
    return <Loader active={true} inline="centered" />;
  }
  return (
    <List divided={true} relaxed={true} verticalAlign="middle" className="list">
      {renderArray(renderCategory, p.questionnaire.categories)}
      {editable(p) && renderNewCategoryControl()}
    </List>
  );
};
const CategoryList = deleteCategory<IProps>(CategoryListInner);
export { CategoryList };
