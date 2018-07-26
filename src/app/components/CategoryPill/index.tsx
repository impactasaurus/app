import * as React from 'react';
import {IOutcomeResult} from 'apollo/modules/outcomeSets';
import {ICategoryMutation, setCategory} from 'apollo/modules/categories';
import {ICategory} from 'models/category';
import { Label, Select, Loader } from 'semantic-ui-react';
import './style.less';
const ReactGA = require('react-ga');

interface IProps extends ICategoryMutation {
  questionID: string;
  outcomeSetID: string;
  data: IOutcomeResult;
  cssClass?: string;
}

interface IState {
  error?: string;
  editClicked?: boolean;
  settingCategory?: string;
}

class CategoryPillInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      editClicked: false,
      settingCategory: null,
      error: null,
    };
    this.setEditMode = this.setEditMode.bind(this);
    this.renderPill = this.renderPill.bind(this);
    this.getCategoryOptions = this.getCategoryOptions.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.setCategory = this.setCategory.bind(this);
  }

  private setEditMode() {
    this.setState({
      editClicked: true,
    });
  }

  private getCategory(id): ICategory {
    return this.props.data.getOutcomeSet.categories.find((c) => c.id === id);
  }

  private renderPill(className: string, text: string, saving=false): JSX.Element {
    let leftComponent = (<span />);
    if (saving) {
      leftComponent = (<Loader active={true} inline={true} size="mini" />);
    }
    return (
      <Label as="a" className={`category-pill ${className} ${this.props.cssClass || ''}`} horizontal={true} onClick={this.setEditMode}>
        {leftComponent} {text}
      </Label>
    );
  }

  private renderSavingControl(): JSX.Element {
    return this.renderPill('set', this.state.settingCategory, true);
  }

  private getCategoryOptions() {
    const categories = this.props.data.getOutcomeSet.categories.map((os) => {
      return {
        key: os.id,
        value: os.id,
        text: os.name,
      };
    });
    categories.unshift({
        key: null,
        value: null,
        text: 'No Category',
    });
    return categories;
  }

  private logCategoryGAEvent(isCategorySet, newCategoryId) {
    let action = '';

    if (isCategorySet && newCategoryId !== null) {
      action = 'changed';
    } else if (!isCategorySet && newCategoryId !== null) {
      action = 'categorised';
    } else {
      action = 'uncategorised';
    }

    ReactGA.event({
      category: 'question',
      action,
      label: 'likert',
    });
  }

  private isCategorySet() {
    const os = this.props.data.getOutcomeSet;
    const q = os.questions.find((q) => q.id === this.props.questionID);

    if (q !== undefined && q.categoryID !== null && q.categoryID !== undefined) {

      const cat = this.getCategory(q.categoryID);
      return cat !== null && cat !== undefined;
    }

    return false;
  }

  private setCategory(_, data) {
    let categoryName = 'No Category';
    const isCategorySet = this.isCategorySet();

    if (data.value !== null) {
      const cat = this.getCategory(data.value);
      categoryName = cat.name;
    }

    if (!isCategorySet && data.value === null) {
      this.setState({
        editClicked: false,
        settingCategory: null,
        error: null,
      });
      return;
    }

    this.setState({
      editClicked: false,
      settingCategory: categoryName,
      error: null,
    });
    this.props.setCategory(this.props.outcomeSetID, this.props.questionID, data.value)
    .then(() => {
      this.logCategoryGAEvent(isCategorySet, data.value);
      this.setState({
        settingCategory: null,
        error: null,
      });
    })
    .catch(() => {
      this.setState({
        error: 'Setting category failed',
        settingCategory: null,
      });
    });
  }

  private renderEditControl(): JSX.Element {
    return (<Select placeholder="Select new category" options={this.getCategoryOptions()} onChange={this.setCategory} />);
  }

  public render() {
    if (this.props.data.loading) {
      return this.renderPill('empty', 'Loading...', true);
    }
    if (this.state.editClicked) {
      return this.renderEditControl();
    }
    if (this.state.settingCategory !== null) {
      return this.renderSavingControl();
    }
    if (this.state.error !== null) {
      return this.renderPill('failure', this.state.error);
    }
    const os = this.props.data.getOutcomeSet;
    const q = os.questions.find((q) => q.id === this.props.questionID);
    if (q === undefined) {
      return this.renderPill('empty', 'Unknown Category');
    }
    if (q.categoryID === null || q.categoryID === undefined) {
      return this.renderPill('empty', 'No Category');
    }
    const cat = this.getCategory(q.categoryID);
    if (cat === null || cat === undefined) {
      return this.renderPill('empty', 'Unknown Category');
    }
    return this.renderPill('set', cat.name);
  }
}

const CategoryPill = setCategory<IProps>(CategoryPillInner);
export { CategoryPill };
