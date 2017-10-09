import * as React from 'react';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {ICategoryMutation, deleteCategory} from 'apollo/modules/categories';
import {renderArray} from 'helpers/react';
import {ICategory} from 'models/category';
import {IOutcomeSet} from 'models/outcomeSet';
import { List, Loader, Button, Popup } from 'semantic-ui-react';
import {NewQuestionCategory} from 'components/NewQuestionCategory';
import {EditQuestionCategory} from 'components/EditQuestionCategory';
import {ConfirmButton} from 'components/ConfirmButton';
import {isNullOrUndefined} from 'util';

interface IProps extends ICategoryMutation {
  outcomeSetID: string;
  data?: IOutcomeResult;
};

interface IState {
  newCategoryClicked?: boolean;
  editedCategoryId?: string;
};

class CategoryListInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.renderCategory = this.renderCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.setNewCategoryClicked = this.setNewCategoryClicked.bind(this);
    this.setEditedCategoryId = this.setEditedCategoryId.bind(this);
  }

  private deleteCategory(categoryID: string) {
    return (): Promise<IOutcomeSet> => {
      return this.props.deleteCategory(this.props.outcomeSetID, categoryID)
      .catch((e: Error) => {
        if (e.message.indexOf('being used') !== -1) {
          throw Error('Cannot delete a category which is in use');
        }
        throw e;
      });
    };
  }

  private setNewCategoryClicked(newValue: boolean): ()=>void {
    return () => {
      this.setState({
        newCategoryClicked: newValue,
      });
    };
  }

  private setEditedCategoryId(categoryId: string): ()=>void {
    return () => {
      this.setState({
        editedCategoryId: categoryId,
      });
    };
  }

  private renderCategory(c: ICategory): JSX.Element {
    if (!isNullOrUndefined(this.state.editedCategoryId) && this.state.editedCategoryId === c.id) {
      return (
        <List.Item className="edit-control" key={c.id}>
          <List.Content>
            <EditQuestionCategory
              category={c}
              QuestionSetID={this.props.outcomeSetID}
              CategoryID={c.id}
              OnSuccess={this.setEditedCategoryId(null)}
            />
          </List.Content>
        </List.Item>
      );
    }

    const editButton = (
        <span>
          <Button onClick={this.setEditedCategoryId(c.id)} icon="edit" tooltip="Edit" compact size="tiny" />
        </span>
    );

    return (
      <List.Item className="category" key={c.id}>
        <List.Content floated="right" verticalAlign="middle">
          <Popup trigger={editButton} content="Edit" />
          <ConfirmButton onConfirm={this.deleteCategory(c.id)} promptText="Are you sure you want to delete this category?" buttonProps={{icon: 'delete', compact:true, size:'tiny'}} tooltip="Delete" />
        </List.Content>
        <List.Content verticalAlign="middle">
          <List.Header>{c.name}</List.Header>
          <List.Description>{c.description}</List.Description>
        </List.Content>
      </List.Item>
    );
  }

  private renderNewCategoryControl(): JSX.Element {
    if (this.state.newCategoryClicked === true) {
      return (
        <List.Item className="new-control">
          <List.Content>
            <NewQuestionCategory QuestionSetID={this.props.outcomeSetID} OnSuccess={this.setNewCategoryClicked(false)} />
          </List.Content>
        </List.Item>
      );
    } else {
      return (
        <List.Item className="new-control">
          <List.Content onClick={this.setNewCategoryClicked(true)}>
            <List.Header as="a">New Question Category</List.Header>
          </List.Content>
        </List.Item>
      );
    }
  }

  public render() {
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    const { data } = this.props;
    const os = data.getOutcomeSet;
    if (os === undefined) {
        return (<div />);
    }
    return (
      <List divided relaxed verticalAlign="middle" className="list">
        {renderArray(this.renderCategory, os.categories)}
        {this.renderNewCategoryControl()}
      </List>
    );
  }
}
const CategoryList = getOutcomeSet<IProps>((props) => props.outcomeSetID)(deleteCategory<IProps>(CategoryListInner));
export { CategoryList }
